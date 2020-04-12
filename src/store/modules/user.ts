import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { login, getUserInfo } from '@/api/users'
import { getToken, setToken, removeToken } from '@/utils/cookies'
import store from '@/store'

export interface IUserState {
  token: string
  username: string
  fio: string
  telephone: string
  lastLogin: Date
  isSuperuser: boolean
  avatar: string
  email: string
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public token = getToken() || ''
  public username = ''
  public fio = ''
  public telephone = ''
  public lastLogin = new Date()
  public isSuperuser = false
  public avatar = ''
  public email = ''

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  private SET_UNAME(name: string) {
    this.username = name
  }

  @Mutation
  private SET_FIO(fio: string) {
    this.fio = fio
  }

  @Mutation
  private SET_TELEPHONE(tel: string) {
    this.telephone = tel
  }

  @Mutation
  private SET_LAST_LOGIN(lastLogin: Date) {
    this.lastLogin = lastLogin
  }

  @Mutation
  private SET_IS_SUPERUSER(su: boolean) {
    this.isSuperuser = su
  }

  @Mutation
  private SET_AVATAR(avatar: string) {
    this.avatar = avatar
  }

  @Mutation
  private SET_EMAIL(email: string) {
    this.email = email
  }

  @Action
  public async Login(userInfo: { username: string, password: string }) {
    userInfo.username = userInfo.username.trim()
    const { data } = await login(userInfo)
    setToken(data.token)
    this.SET_TOKEN(data.token)
  }

  @Action
  public ResetToken() {
    removeToken()
    this.SET_TOKEN('')
  }

  @Action
  public async GetUserInfo() {
    if (this.token === '') {
      throw Error('GetUserInfo: token is undefined!')
    }
    const { data } = await getUserInfo()
    if (!data) {
      throw Error('Verification failed, please Login again.')
    }
    const { fio, username, avatar, telephone, email } = data
    this.SET_UNAME(username)
    this.SET_FIO(fio)
    this.SET_AVATAR(avatar)
    this.SET_TELEPHONE(telephone)
    this.SET_EMAIL(email)
  }

  @Action
  public async LogOut() {
    if (this.token === '') {
      throw Error('LogOut: token is undefined!')
    }
    // await logout()
    removeToken()
    this.SET_TOKEN('')
  }
}

export const UserModule = getModule(User)
