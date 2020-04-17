import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import {
  getVlanIf, delVlanIf,
  addVlanIf, changeVlanIf
} from '@/api/networks/req'
import { IVlanIf } from '@/api/networks/types'

@Module({ dynamic: true, store, name: 'vlan' })
class VlanIf extends VuexModule implements IVlanIf {
  id = 0
  title = ''
  vid = 0
  is_management = false

  @Mutation
  private SET_PK(pk: number) {
    this.id = pk
  }

  @Mutation
  private SET_TITLE(title: string) {
    this.title = title
  }

  @Mutation
  private SET_VID(vid: number) {
    this.vid = vid
  }

  @Mutation
  private SET_IS_MNG(isMng: boolean) {
    this.is_management = isMng
  }

  @Mutation
  public RESET_ALL() {
    this.id = 0
    this.title = ''
    this.vid = 0
    this.is_management = false
    return this
  }

  @Mutation
  public SET_ALL(data: IVlanIf) {
    this.id = data.id
    this.title = data.title
    this.vid = data.vid
    this.is_management = data.is_management
    return this
  }

  @Action
  public async GetVlan(vlanId: number) {
    const r = await getVlanIf(vlanId)
    this.SET_ALL(r.data)
    return r
  }

  @Action
  public async AddVlan(data: IVlanIf) {
    return await addVlanIf(data)
  }

  @Action
  public async SaveVlan() {
    const r = await changeVlanIf(this.id, <IVlanIf>{
      id: this.id,
      title: this.title,
      vid: this.vid,
      is_management: this.is_management
    })
    this.SET_ALL(r.data)
    return r
  }

  @Action
  public async GetAllVlanState() {
    return {
      id: this.id,
      title: this.title,
      vid: this.vid,
      is_management: this.is_management
    }
  }

  @Action
  public async DelVlan(vlanId: number) {
    await delVlanIf(vlanId)
    this.RESET_ALL()
  }
}

export const VlanIfModule = getModule(VlanIf)
