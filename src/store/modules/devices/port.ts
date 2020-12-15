import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import {
  getPort, delPort,
  addPort, changePort,
  togglePort, scanMacAddressPort,
  scanPortVlans
} from '@/api/devices/req'
import { IPort, IDevTogglePortRequest } from '@/api/devices/types'

@Module({ dynamic: true, store, name: 'port' })
class Port extends VuexModule implements IPort {
  pk = 0
  device = 0
  num = 0
  descr = ''
  user_count = 0

  @Mutation
  private RESET_ALL_PORT() {
    this.pk = 0
    this.device = 0
    this.num = 0
    this.descr = ''
    this.user_count = 0
  }

  @Mutation
  public SET_PORT_PK(id: number) {
    this.pk = id
  }

  @Mutation
  private SET_ALL_PORT(port: IPort) {
    this.pk = port.pk
    this.device = port.device
    this.num = port.num
    this.descr = port.descr
    this.user_count = port.user_count
  }

  @Action
  public async GetPort(id: number) {
    const r = await getPort(id)
    this.SET_ALL_PORT(r.data)
    return r
  }

  @Action
  public async AddPort(info: object) {
    const { data } = await addPort(info)
    return data
  }

  @Action
  public async PatchPort(info: object) {
    const { data } = await changePort(this.pk, info)
    this.SET_ALL_PORT(data)
    return data
  }

  @Action
  public async DelPort(id: number) {
    await delPort(id)
    this.RESET_ALL_PORT()
  }

  @Action
  public async TogglePort(preq: IDevTogglePortRequest) {
    await togglePort(this.pk, preq)
  }

  @Action
  public async ScanMacAddressPort(id: number) {
    const { data } = await scanMacAddressPort(id)
    return data
  }

  @Action
  public async ScanPortVlans(portId: number) {
    const { data } = await scanPortVlans(portId)
    return data
  }

  // @Action
  // public async VlanConfigApply(portId: number, conf: IPortVlanConfig) {
  //   await vlanConfigApply(portId, conf)
  // }
}
export const PortModule = getModule(Port)
