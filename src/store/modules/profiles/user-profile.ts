/* eslint-disable camelcase */
import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { IUserProfile, IPasswordUpdateForm } from '@/api/profiles/types'
import {
  getProfile,
  delProfile,
  changeProfile,
  addProfile,
  setProfilePassword
} from '@/api/profiles/req'

@Module({ dynamic: true, store, name: 'userprofile' })
class UserProfile extends VuexModule implements IUserProfile {
  id = 0
  token = ''
  username = ''
  fio = ''
  birth_day = ''
  is_active = false
  is_admin = false
  telephone = ''
  avatar = ''
  email = ''
  full_name = ''
  last_login = ''
  is_superuser = false
  user_permissions: number[] = []
  groups: number[] = []
  access_level = 0
  sites: number[] = []

  @Mutation
  public SET_ALL_PROFILE(data: IUserProfile) {
    this.id = data.id
    this.username = data.username
    this.fio = data.fio
    this.birth_day = data.birth_day
    this.is_active = data.is_active
    this.is_admin = data.is_admin
    this.telephone = data.telephone
    this.avatar = data.avatar
    this.email = data.email
    this.full_name = data.full_name!
    this.last_login = data.last_login!
    this.is_superuser = data.is_superuser!
    this.user_permissions = data.user_permissions
    this.groups = data.groups
    this.access_level = data.access_level
    this.sites = data.sites || []
  }

  @Mutation
  public RESET_ALL_PROFILE() {
    this.id = 0
    this.username = ''
    this.fio = ''
    this.birth_day = ''
    this.is_active = false
    this.is_admin = false
    this.telephone = ''
    this.avatar = ''
    this.email = ''
    this.full_name = ''
    this.last_login = ''
    this.is_superuser = false
    this.user_permissions = []
    this.groups = []
    this.access_level = 0
    this.sites = []
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
