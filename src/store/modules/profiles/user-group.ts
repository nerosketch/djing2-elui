import { Module, Mutation, Action, getModule, VuexModule } from 'vuex-module-decorators'
import store from '@/store'
import { getUserGroup, patchUserGroup, addUserGroup } from '@/api/profiles/req'
import { IUserGroup } from '@/api/profiles/types'

@Module({ dynamic: true, store, name: 'usergroup' })
class UserGroup extends VuexModule implements IUserGroup {
  public id = 0
  public name = ''
  public permissions: number[] = []

  @Mutation
  public SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  public SET_ALL_USER_USER_GROUP(data: IUserGroup) {
    this.id = data.id
    this.name = data.name
    this.permissions = data.permissions
  }

  @Mutation
  public RESET_ALL_USER_USER_GROUP() {
    this.id = 0
    this.name = ''
    this.permissions = []
  }

  @Action
  public async GetUserGroup(id?: number) {
    if (!id) {
      id = this.id
    }
    const { data } = await getUserGroup(id)
    this.SET_ALL_USER_USER_GROUP(data)
    return data
  }

  @Action
  public async PatchUserGroup(info: object) {
    const { data } = await patchUserGroup(this.id, info)
    this.SET_ALL_USER_USER_GROUP(data)
    return data
  }

  @Action
  public async AddUserGroup(info: object) {
    const { data } = await addUserGroup(info)
    this.SET_ALL_USER_USER_GROUP(data)
    return data
  }
}
export const UserGroupModule = getModule(UserGroup)
