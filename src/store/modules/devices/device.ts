import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import {
  getDevice, delDevice,
  addDevice, changeDevice
} from '@/api/devices/req'
import { IDevice, IDeviceTypeEnum } from '@/api/devices/types'

@Module({ dynamic: true, store, name: 'vlan' })
class Device extends VuexModule implements IDevice {
  pk = 0
  ip_address = ''
  mac_addr = ''
  comment = ''
  dev_type = IDeviceTypeEnum.UNKNOWN
  dev_type_str = ''
  man_passw = ''
  group = 0
  parent_dev = 0
  snmp_extra = ''
  extra_data = {}
  vlans: number[] = []
  status = 0
  is_noticeable = false

  @Mutation
  public RESET_ALL() {
    this.pk = 0
    this.ip_address = ''
    this.mac_addr = ''
    this.comment = ''
    this.dev_type = IDeviceTypeEnum.UNKNOWN
    this.dev_type_str = ''
    this.man_passw = ''
    this.group = 0
    this.parent_dev = 0
    this.snmp_extra = ''
    this.extra_data = {}
    this.vlans = []
    this.status = 0
    this.is_noticeable = false
    return this
  }

  @Mutation
  public SET_ALL(data: IDevice) {
    this.pk = data.pk
    this.ip_address = data.ip_address
    this.mac_addr = data.mac_addr
    this.comment = data.comment
    this.dev_type = data.dev_type
    this.dev_type_str = data.dev_type_str
    this.man_passw = data.man_passw
    this.group = data.group
    this.parent_dev = data.parent_dev
    this.snmp_extra = data.snmp_extra
    this.extra_data = data.extra_data
    this.vlans = data.vlans
    this.status = data.status
    this.is_noticeable = data.is_noticeable
    return this
  }

  @Action
  public async GetDevice(id: number) {
    const r = await getDevice(id)
    this.SET_ALL(r.data)
    return r
  }

  @Action
  public async AddDevice(data: IDevice) {
    return await addDevice(data)
  }

  @Action
  public async SaveDevice() {
    const r = await changeDevice(this.pk, <IDevice>{
      ip_address: this.ip_address,
      mac_addr: this.mac_addr,
      comment: this.comment,
      dev_type: this.dev_type,
      man_passw: this.man_passw,
      group: this.group,
      parent_dev: this.parent_dev,
      snmp_extra: this.snmp_extra,
      extra_data: this.extra_data
    })
    this.SET_ALL(r.data)
    return r
  }

  @Action
  public async DelDevice(id: number) {
    await delDevice(id)
    this.RESET_ALL()
  }
}

export const DeviceModule = getModule(Device)
