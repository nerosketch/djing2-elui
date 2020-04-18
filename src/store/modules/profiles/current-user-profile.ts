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
  avatar?: string
  email: string
  full_name?: string
}

@Module({ dynamic: true, store, name: 'currentuserprofile' })
class CurrentUserProfile extends VuexModule implements ICurrentUserProfile {
  public token = getToken() || ''
  public username = ''
  public fio = ''
  public is_active = false
  public telephone = ''
  public avatar = ''
  public email = ''
  public full_name = ''

  @Mutation
  public SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  public SET_ALL_CURRENT_PROFILE(data: IUserProfile) {
    this.username = data.username
    this.fio = data.fio
    this.is_active = data.is_active
    this.telephone = data.telephone
    this.avatar = data.avatar!
    this.email = data.email
    this.full_name = data.full_name!
  }

  @Mutation
  public RESET_ALL() {
    this.token = ''
    this.username = ''
    this.fio = ''
    this.is_active = false
    this.telephone = ''
    this.avatar = ''
    this.email = ''
    this.full_name = ''
  }

  @Mutation
  public COPY_FROM_ORIG(orig: IUserProfile) {
    this.username = orig.username
    this.fio = orig.fio
    this.is_active = orig.is_active
    this.telephone = orig.telephone
    this.avatar = orig.avatar!
    this.email = orig.email
    this.full_name = orig.full_name!
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
    if (this.token === '') {
      throw Error('LogOut: token is undefined!')
    }
    // await logout()
    removeToken()
    this.SET_TOKEN('')
    this.RESET_ALL()
  }
}
export const CurrentUserProfileModule = getModule(CurrentUserProfile)
