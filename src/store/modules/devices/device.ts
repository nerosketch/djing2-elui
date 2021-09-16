/* eslint-disable camelcase */
import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import {
  IDevice, IDeviceInterace,
  IDeviceTypeEnum
} from '@/api/devices/types'
import {
  getDevice, delDevice,
  addDevice, changeDevice,
  scanAllDevVlans, scanAllDevMac,
  scanOltFibers, scanPorts,
  scanUnitsUnregistered,
  getDeviceConfigChoices,
  removeFromOlt,
  fixOnu
} from '@/api/devices/req'
import store from '@/store'

export interface IDeviceTypeName {
  nm: string,
  v: IDeviceTypeEnum
}

@Module({ dynamic: true, store, name: 'devicemodule' })
class Device extends VuexModule implements IDeviceInterace {
  id = 0
  ip_address = ''
  mac_addr = ''
  comment = ''
  dev_type = IDeviceTypeEnum.UNKNOWN
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
  locality = 0
  locality_title = ''
  street = 0
  street_name = ''
  place = ''

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
    this.code = ''
    this.sites = []
    this.create_time = ''
    this.locality = 0
    this.locality_title = ''
    this.street = 0
    this.street_name = ''
    this.place = ''
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
    this.locality = data.locality
    this.locality_title = data.locality_title
    this.street = data.status
    this.street_name = data.street_name
    this.place = data.place
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
  public getDeviceTypeNames(): Promise<IDeviceTypeName[]> {
    return [
      { nm: 'Не выбрано', v: IDeviceTypeEnum.UNKNOWN },
      { nm: 'Dlink DGS1100_10/ME', v: IDeviceTypeEnum.DlinkDGS1100_10ME },
      { nm: 'BDCOM P3310C', v: IDeviceTypeEnum.BDCOM_P3310C },
      { nm: 'EPON BDCOM FORA', v: IDeviceTypeEnum.EPON_BDCOM_FORA },
      { nm: 'Eltex Switch', v: IDeviceTypeEnum.EltexSwitch },
      { nm: 'ZTE C320', v: IDeviceTypeEnum.ZTE_C320 },
      { nm: 'Onu ZTE F660', v: IDeviceTypeEnum.OnuZTE_F660 },
      { nm: 'Onu ZTE F601', v: IDeviceTypeEnum.OnuZTE_F601 },
      { nm: 'Huawei S2300', v: IDeviceTypeEnum.HuaweiS2300 },
      { nm: 'Huawei S5300 10P LI AC', v: IDeviceTypeEnum.HuaweiS5300_10P_LI_ACInterface },
      { nm: 'Dlink DGS_3120_24SC', v: IDeviceTypeEnum.DlinkDGS_3120_24SCSwitchInterface },
      { nm: 'Dlink DGS_1100_06/ME', v: IDeviceTypeEnum.DlinkDGS_1100_06MESwitchInterface },
      { nm: 'Dlink DGS_3627G', v: IDeviceTypeEnum.DlinkDGS_3627GSwitchInterface }
    ] as any
  }

  public get isOnuRegistered() {
    return Boolean(this.snmp_extra)
  }

  @Action
  public async FixOnu(devId?: number) {
    if (!devId || devId === 0) {
      devId = this.id
    }
    let { data } = await fixOnu(devId)
    this.SET_ALL_DEV(data.device)
    return data
  }
}

export const DeviceModule = getModule(Device)
