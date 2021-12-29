import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { getGroup, delGroup, addGroup, changeGroup } from '@/api/groups/req'
import { IGroup } from '@/api/groups/types'
import store from '@/store'

@Module({ dynamic: true, store, name: 'group' })
class Group extends VuexModule implements IGroup {
  public id = 0
  public title = ''
  public sites?: number[] = []

  @Mutation
  public SET_ALL_MGROUP(data: IGroup) {
    this.id = data.id
    this.title = data.title
    this.sites = data.sites || []
    return this
  }

  @Mutation
  public RESET_ALL_MGROUP() {
    this.id = 0
    this.title = ''
    this.sites = []
    return this
  }

  @Action
  public async GetGroup(groupId: number) {
    const { data } = await getGroup(groupId)
    this.SET_ALL_MGROUP(data)
    return data
  }

  @Action
  public async AddGroup(grp: object) {
    const { data } = await addGroup(grp)
    this.SET_ALL_MGROUP(data)
  }

  @Action
  public async PatchGroup(newData: object) {
    const { data } = await changeGroup(this.id, newData)
    this.SET_ALL_MGROUP(data)
  }

  @Action
  public async DelGroup(groupId: number) {
    await delGroup(groupId)
    this.RESET_ALL_MGROUP()
  }
}

export const GroupModule = getModule(Group)
