import { Module, Mutation, Action, getModule, VuexModule } from 'vuex-module-decorators'
import store from '@/store'
import { getToken, setToken, removeToken } from '@/utils/cookies'
import { getSelfProfile, login } from '@/api/profiles/req'
import { IUserProfile } from '@/api/profiles/types'

export interface ICurrentUserProfile {
  token: string
  username: string
  fio: string
  is_active: boolean
  telephone: string
  avatar: string
  email: string
  full_name?: string
  last_login?: string
  is_superuser?: boolean
}

@Module({ dynamic: true, store, name: 'currentuserprofile' })
class CurrentUserProfile extends VuexModule implements ICurrentUserProfile {
  public pk = 0
  public token = getToken() || ''
  public username = ''
  public fio = ''
  public is_active = false
  public telephone = ''
  protected _avatar = ''
  public email = ''
  public full_name = ''
  public last_login = ''
  public is_superuser = false

  @Mutation
  public SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  public SET_ALL_CURRENT_PROFILE(data: IUserProfile) {
    this.pk = data.pk
    this.username = data.username
    this.fio = data.fio
    this.is_active = data.is_active
    this.telephone = data.telephone
    this._avatar = data.avatar
    this.email = data.email
    this.full_name = data.full_name!
    this.last_login = data.last_login!
    this.is_superuser = data.is_superuser!
  }

  @Mutation
  public RESET_ALL_CURRENT_PROFILE() {
    this.pk = 0
    this.token = ''
    this.username = ''
    this.fio = ''
    this.is_active = false
    this.telephone = ''
    this._avatar = ''
    this.email = ''
    this.full_name = ''
    this.last_login = ''
    this.is_superuser = false
  }

  public get avatar(): string {
    if (this._avatar) {
      return this._avatar
    } else {
      return '/img/user_ava_min.gif'
    }
  }

  public get isAvatar() {
    return Boolean(this._avatar)
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
    this.SET_ALL_CURRENT_PROFILE(data)
    return data
  }

  @Action
  public async Login(userInfo: { username: string, password: string }) {
    userInfo.username = userInfo.username.trim()
    const { data } = await login(userInfo)
    setToken(data.token)
    this.SET_TOKEN(data.token)
    await this.GetSelf()
  }

  @Action
  public ResetToken() {
    removeToken()
    this.SET_TOKEN('')
  }

  @Action
  public async LogOut() {
    if (!this.token) {
      throw Error('LogOut: token is undefined!')
    }
    // await logout()
    removeToken()
    this.SET_TOKEN('')
    this.RESET_ALL_CURRENT_PROFILE()
  }
}
export const CurrentUserProfileModule = getModule(CurrentUserProfile)
