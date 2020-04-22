import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { IUserProfile } from '@/api/profiles/types'
import { getProfile, delProfile, changeProfile, addProfile } from '@/api/profiles/req'

@Module({ dynamic: true, store, name: 'userprofile' })
class UserProfile extends VuexModule implements IUserProfile {
  pk = 0
  username = ''
  fio = ''
  is_active = false
  is_admin = false
  telephone = ''
  avatar = ''
  email = ''
  full_name = ''
  last_login = ''
  is_superuser = false

  @Mutation
  public SET_ALL_PROFILE(data: IUserProfile) {
    this.pk = data.pk
    this.username = data.username
    this.fio = data.fio
    this.is_active = data.is_active
    this.is_admin = data.is_admin
    this.telephone = data.telephone
    this.avatar = data.avatar!
    this.email = data.email
    this.full_name = data.full_name!
    this.last_login = data.last_login!
    this.is_superuser = data.is_superuser!
  }

  @Mutation
  public RESET_ALL_PROFILE() {
    this.pk = 0
    this.username = ''
    this.fio = ''
    this.is_active = false
    this.is_admin = false
    this.telephone = ''
    this.avatar = ''
    this.email = ''
    this.full_name = ''
    this.last_login = ''
    this.is_superuser = false
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
}
export const UserProfileModule = getModule(UserProfile)
