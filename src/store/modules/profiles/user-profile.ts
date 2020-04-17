import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { IUserProfile } from '@/api/profiles/types'
import { getToken, setToken, removeToken } from '@/utils/cookies'
import { getProfile, delProfile, changeProfile, getSelfProfile, login } from '@/api/profiles/req'

@Module({ dynamic: true, store, name: 'userprofile' })
class UserProfile extends VuexModule implements IUserProfile {
  public token = getToken() || ''
  pk = 0
  username = ''
  fio = ''
  is_active = false
  is_admin = false
  telephone = ''
  avatar = ''
  email = ''
  full_name = ''

  @Mutation
  public SET_ALL(data: IUserProfile) {
    this.pk = data.pk
    this.username = data.username
    this.fio = data.fio
    this.is_active = data.is_active
    this.is_admin = data.is_admin
    this.telephone = data.telephone
    this.avatar = data.avatar!
    this.email = data.email
    this.full_name = data.full_name!
  }

  @Mutation
  public RESET_ALL() {
    this.pk = 0
    this.username = ''
    this.fio = ''
    this.is_active = false
    this.is_admin = false
    this.telephone = ''
    this.avatar = ''
    this.email = ''
    this.full_name = ''
  }

  @Mutation
  public SET_TOKEN(token: string) {
    this.token = token
  }

  @Action
  public async GetProfile(uname: string) {
    const { data } = await getProfile(uname)
    this.SET_ALL(data)
    return data
  }

  @Action
  public async DelProfile(uname: string) {
    await delProfile(uname)
    this.RESET_ALL()
  }

  @Action
  public async PatchProfile(info: object) {
    const { data } = await changeProfile(this.username, info)
    this.SET_ALL(data)
    return data
  }

  @Action
  public async GetSelf() {
    if (this.token === '') {
      throw Error('GetUserInfo: token is undefined!')
    }
    const { data } = await getSelfProfile()
    if (!data) {
      throw Error('Verification failed, please Login again.')
    }
    this.SET_ALL(data)
    return data
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
  public async LogOut() {
    if (this.token === '') {
      throw Error('LogOut: token is undefined!')
    }
    // await logout()
    removeToken()
    this.SET_TOKEN('')
  }
}
export const UserProfileModule = getModule(UserProfile)
