import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { IUserProfile } from '@/api/profiles/types'
import { getProfile, delProfile, changeProfile } from '@/api/profiles/req'

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

  @Action
  public async GetProfile(id: number) {
    const { data } = await getProfile(id)
    this.SET_ALL(data)
  }

  @Action
  public async DelProfile(id: number) {
    await delProfile(id)
    this.RESET_ALL()
  }

  @Action
  public async PatchProfile(info: object) {
    const { data } = await changeProfile(this.pk, info)
    this.SET_ALL(data)
  }
}
export const UserProfileModule = getModule(UserProfile)
