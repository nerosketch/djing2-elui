/* eslint-disable camelcase */
import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import {
  IDevice, IDeviceInterface
} from '@/api/devices/types'
import {
  getDevice, delDevice,
  addDevice, changeDevice,
  scanAllDevVlans, scanAllDevMac,
  scanOltFibers, scanPorts,
  scanUnitsUnregistered,
  getDeviceConfigChoices,
  removeFromOlt,
  fixOnu,
  getDeviceTypes
} from '@/api/devices/req'
import store from '@/store'

@Module({ dynamic: true, store, name: 'devicemodule' })
class Device extends VuexModule implements IDeviceInterface {
  id = 0
  ip_address = ''
  mac_addr = ''
  comment = ''
  dev_type = 0
  dev_type_str = ''
  man_passw = ''
  group = 0
  parent_dev = 0
  parent_dev_name = ''
  snmp_extra = ''
  extra_data = {}
  vlans: number[] = []
  status = 0
  is_noticeable = false
  code = ''
  sites?: number[] = []
  create_time = ''
  address: number | null = null
  address_title = ''

  loadProgress = false

  @Mutation
  private SET_LOADING(l: boolean) {
    this.loadProgress = l
  }

  @Mutation
  public RESET_ALL_DEV() {
    this.id = 0
    this.ip_address = ''
    this.mac_addr = ''
    this.comment = ''
    this.dev_type = 0
    this.dev_type_str = ''
    this.man_passw = ''
    this.group = 0
    this.parent_dev = 0
    this.snmp_extra = ''
    this.extra_data = {}
    this.vlans = []
    this.status = 0
    this.is_noticeable = false
    this.code = ''
    this.sites = []
    this.create_time = ''
    this.address = null
    this.address_title = ''
    return this
  }

  @Mutation
  public SET_ALL_DEV(data: IDevice) {
    this.id = data.id
    this.ip_address = data.ip_address
    this.mac_addr = data.mac_addr
    this.comment = data.comment
    this.dev_type = data.dev_type
    this.dev_type_str = data.dev_type_str!
    this.man_passw = data.man_passw
    this.group = data.group
    this.parent_dev = data.parent_dev
    this.parent_dev_name = data.parent_dev_name!
    this.snmp_extra = data.snmp_extra
    this.extra_data = data.extra_data
    this.vlans = data.vlans
    this.status = data.status
    this.is_noticeable = data.is_noticeable
    this.code = data.code
    this.sites = data.sites
    this.create_time = data.create_time
    this.address = data.address
    this.address_title = data.address_title
    return this
  }

  @Mutation
  public SET_SNMP_EXTRA(v: string) {
    this.snmp_extra = v
  }

  @Action
  public async GetDevice(id: number) {
    this.SET_LOADING(true)
    try {
      const r = await getDevice(id)
      this.SET_ALL_DEV(r.data)
      return r
    } finally {
      this.SET_LOADING(false)
    }
  }

  @Action
  public async AddDevice(newDev: object) {
    this.SET_LOADING(true)
    try {
      const { data } = await addDevice(newDev)
      this.SET_ALL_DEV(data)
      return data
    } finally {
      this.SET_LOADING(false)
    }
  }

  @Action
  public async PatchDevice(newData: object) {
    this.SET_LOADING(true)
    try {
      const r = await changeDevice(this.id, newData)
      this.SET_ALL_DEV(r.data)
      return r
    } finally {
      this.SET_LOADING(false)
    }
  }

  @Action
  public async DelDevice(id: number) {
    await delDevice(id)
    this.RESET_ALL_DEV()
  }

  @Action
  public async ScanAllDevVlans(devId?: number) {
    if (!devId || devId === 0) {
      devId = this.id
    }
    const { data } = await scanAllDevVlans(devId)
    return data
  }

  @Action
  public async ScanAllDevMac(devId: number, vid: number) {
    const { data } = await scanAllDevMac(devId, vid)
    return data
  }

  @Action
  public async ScanOltFibers(devId: number) {
    const { data } = await scanOltFibers(devId)
    return data
  }

  @Action
  public async ScanPorts(devId: number) {
    const { data } = await scanPorts(devId)
    return data
  }

  @Action
  public async ScanUnitsUnregistered(devId: number) {
    const { data } = await scanUnitsUnregistered(devId)
    return data
  }

  @Action
  public async GetConfigChoices(devId?: number) {
    if (!devId || devId === 0) {
      devId = this.id
    }
    const { data } = await getDeviceConfigChoices(devId)
    return data
  }

  @Action
  public async RemoveFromOlt(devId?: number) {
    if (!devId || devId === 0) {
      devId = this.id
    }
    const { data } = await removeFromOlt(devId)
    if (data.status === 1) {
      this.SET_SNMP_EXTRA('')
    }
    return data
  }

  @Action
  public async getDeviceTypeNames() {
    const { data } = await getDeviceTypes()
    return data
  }

  public get isOnuRegistered() {
    return Boolean(this.snmp_extra)
  }

  @Action
  public async FixOnu(devId?: number) {
    if (!devId || devId === 0) {
      devId = this.id
    }
    const { data } = await fixOnu(devId)
    this.SET_ALL_DEV(data.device)
    return data
  }
}

export const DeviceModule = getModule(Device)
