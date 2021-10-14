/* eslint-disable camelcase */
import { Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { IUserProfile, IPasswordUpdateForm } from '@/api/profiles/types'
import {
  getProfile,
  delProfile,
  changeProfile,
  addProfile,
  setProfilePassword
} from '@/api/profiles/req'
import BaseProfileVuexModule from './base-profile'

@Module({ dynamic: true, store, name: 'userprofile' })
class UserProfile extends BaseProfileVuexModule implements IUserProfile {
  avatar = ''
  email = ''
  full_name = ''
  user_permissions: number[] = []
  access_level = 0

  @Mutation
  public SET_ALL_PROFILE(data: IUserProfile) {
    this.SET_ALL_BASE_PROFILE(data)
    this.avatar = data.avatar
    this.email = data.email
    this.full_name = data.full_name!
    this.user_permissions = data.user_permissions
    this.access_level = data.access_level
  }

  @Mutation
  public RESET_ALL_PROFILE() {
    this.RESET_ALL_BASE_PROFILE()
    this.avatar = ''
    this.email = ''
    this.full_name = ''
    this.user_permissions = []
    this.access_level = 0
  }

  @Action
  public async GetProfile(uname: string) {
    const { data } = await getProfile(uname)
    this.SET_ALL_PROFILE(data)
    return data
  }

  @Action
  public async AddProfile(newData: object) {
    const { data } = await addProfile(newData)
    this.SET_ALL_PROFILE(data)
    return data
  }

  @Action
  public async DelProfile(uname: string) {
    await delProfile(uname)
    this.RESET_ALL_PROFILE()
  }

  @Action
  public async PatchProfile(info: object) {
    const { data } = await changeProfile(this.username, info)
    this.SET_ALL_PROFILE(data)
    return data
  }

  @Action({ rawError: true })
  public PatchPassword(newPassw: IPasswordUpdateForm) {
    return setProfilePassword(this.username, newPassw)
  }
}
export const UserProfileModule = getModule(UserProfile)
