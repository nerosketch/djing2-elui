/* eslint-disable camelcase */
import {
  Module,
  Mutation,
  Action,
  getModule
} from 'vuex-module-decorators'
import store from '@/store'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/cookies'
import {
  BaseProfileVuexModule,
  RESET_ALL_BASE_PROFILE,
  SET_ALL_BASE_PROFILE
} from './base-profile'
import {
  getSelfProfile,
  login,
  changeProfile,
  changeAvatar
} from '@/api/profiles/req'
import { DEFAULT_USER_AVA, IUserProfile } from '@/api/profiles/types'

@Module({ dynamic: true, store, name: 'currentuserprofile' })
class CurrentUserProfile extends BaseProfileVuexModule implements IUserProfile {
  public token = getToken() || ''
  public avatar = ''
  public email = ''
  public full_name = ''
  public user_permissions: number[] = []
  public access_level = 0

  @Mutation
  public SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  public SET_ALL_CURRENT_PROFILE(data: IUserProfile) {
    SET_ALL_BASE_PROFILE(this, data)
    this.avatar = data.avatar
    this.email = data.email
    this.full_name = data.full_name!
    this.user_permissions = data.user_permissions
    this.access_level = data.access_level
  }

  @Mutation
  public RESET_ALL_CURRENT_PROFILE() {
    RESET_ALL_BASE_PROFILE(this)
    this.avatar = ''
    this.email = ''
    this.full_name = ''
    this.user_permissions = []
    this.access_level = 0
  }

  public get getCurrentAvatar(): string {
    if (this.avatar) {
      return this.avatar
    } else {
      return DEFAULT_USER_AVA
    }
  }

  public get isAvatar() {
    return Boolean(this.avatar)
  }

  @Action({ commit: 'SET_ALL_CURRENT_PROFILE' })
  public async GetSelf() {
    if (this.token === '') {
      throw Error('GetUserInfo: token is undefined!')
    }
    const { data } = await getSelfProfile()
    if (!data) {
      throw Error('Verification failed, please Login again.')
    }
    return data
  }

  @Action({ commit: 'SET_TOKEN' })
  public async Login(userInfo: { username: string, password: string }) {
    userInfo.username = userInfo.username.trim()
    const { data } = await login(userInfo)
    setToken(data.token)
    return data.token
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
    this.ResetToken()
    this.RESET_ALL_CURRENT_PROFILE()
  }

  @Action
  public async PatchPermissions(info: object) {
    const { data } = await changeProfile(this.username, info)
    this.SET_ALL_CURRENT_PROFILE(data)
    return data
  }

  @Action
  public async PatchAvatar(ava: HTMLImageElement) {
    const { data } = await changeAvatar(this.username, ava)
    this.SET_ALL_CURRENT_PROFILE(data)
    return data
  }
}
export const CurrentUserProfileModule = getModule(CurrentUserProfile)
