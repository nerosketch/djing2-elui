import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import {
  getPort, delPort,
  addPort, changePort,
  togglePort, scanMacAddressPort,
  scanPortVlans, vlanConfigApply
} from '@/api/devices/req'
import { IPort, IDevPortState, IPortVlanConfig } from '@/api/devices/types'

@Module({ dynamic: true, store, name: 'port' })
class Port extends VuexModule implements IPort {
  pk = 0
  device = 0
  num = 0
  descr = ''
  user_count = 0

  @Mutation
  private RESET_ALL() {
    this.pk = 0
    this.device = 0
    this.num = 0
    this.descr = ''
    this.user_count = 0
  }

  @Mutation
  private SET_ALL(port: IPort) {
    this.pk = port.pk
    this.device = port.device
    this.num = port.num
    this.descr = port.descr
    this.user_count = port.user_count
  }

  @Action
  public async GetPort(id: number) {
    const r = await getPort(id)
    this.SET_ALL(r.data)
    return r
  }

  @Action
  public async AddDevice(data: IPort) {
    return await addPort(data)
  }

  @Action
  public async SavePort() {
    const r = await changePort(this.pk, <IPort>{
      pk: this.pk,
      device: this.device,
      num: this.num,
      descr: this.descr,
      user_count: this.user_count
    })
    this.SET_ALL(r.data)
    return r
  }

  @Action
  public async DelPort(id: number) {
    await delPort(id)
    this.RESET_ALL()
  }

  @Action
  public async TogglePort(id: number, state: IDevPortState) {
    await togglePort(id, state)
  }

  @Action
  public async TcanMacAddressPort(id: number) {
    const { data } = await scanMacAddressPort(id)
    return data
  }

  @Action
  public async ScanPortVlans(portId: number) {
    const { data } = await scanPortVlans(portId)
    return data
  }

  @Action
  public async VlanConfigApply(portId: number, conf: IPortVlanConfig) {
    await vlanConfigApply(portId, conf)
  }
}