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
  public async AddGroup(data: IGroup) {
    return await addGroup(data)
  }

  @Action
  public async SaveGroup() {
    const r = await changeGroup(this.pk, <IGroup>{
      pk: 0,
      title: this.title,
      code: this.code
    })
    this.SET_ALL(r.data)
    return r
  }

  @Action
  public async DelGroup(groupId: number) {
    await delGroup(groupId)
    this.RESET_ALL()
  }

  @Mutation
  private CHANGE_VAL(payload: { key: string, value: any }) {
    const { key, value } = payload
    if (Object.prototype.hasOwnProperty.call(this, key)) {
      (this as any)[key] = value
    }
  }

  @Action
  public async ChangeParam(payload: { key: string, value: any}) {
    await this.CHANGE_VAL(payload)
  }
}

export const GroupModule = getModule(Group)
