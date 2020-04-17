import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { getGroup, delGroup, addGroup, changeGroup } from '@/api/groups/req'
import { IGroup } from '@/api/groups/types'
import store from '@/store'

@Module({ dynamic: true, store, name: 'group' })
class Group extends VuexModule implements IGroup {
  public pk = 0
  public title = ''
  public code = ''

  @Mutation
  private SET_PK(pk: number): void {
    this.pk = pk
  }

  @Mutation
  private SET_TITLE(title: string): void {
    this.title = title
  }

  @Mutation
  private SET_CODE(code: string): void {
    this.code = code
  }

  @Mutation
  public SET_ALL(data: IGroup) {
    this.pk = data.pk
    this.title = data.title
    this.code = data.code
    return this
  }

  @Mutation
  public RESET_ALL() {
    this.pk = 0
    this.title = ''
    this.code = ''
    return this
  }

  @Action
  public async GetGroup(groupId: number) {
    const r = await getGroup(groupId)
    this.SET_ALL(r.data)
    return r
  }

  @Action
  public async AddGroup(grp: object) {
    const { data } = await addGroup(grp)
    this.SET_ALL(data)
  }

  @Action
  public async SaveGroup() {
    await this.PatchGroup({
      title: this.title,
      code: this.code
    })
  }

  @Action
  public async PatchGroup(newData: object) {
    const { data } = await changeGroup(this.pk, newData)
    this.SET_ALL(data)
  }

  @Action
  public async DelGroup(groupId: number) {
    await delGroup(groupId)
    this.RESET_ALL()
  }
}

export const GroupModule = getModule(Group)
