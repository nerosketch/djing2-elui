import { IDRFAxiosResponsePromise, IDRFListResponse } from '../types'
import { IDRFRequestListParameters } from '@/api/types'

export enum IDeviceTypeEnum {
  UNKNOWN = 0,
  DlinkDGS1100_10ME = 1,
  BDCOM_P3310C = 2,
  EPON_BDCOM_FORA = 3,
  EltexSwitch = 4,
  ZTE_C320 = 5,
  OnuZTE_F660 = 6,
  OnuZTE_F601 = 7,
  HuaweiS2300 = 8,
  DlinkDGS_3120_24SCSwitchInterface = 9,
  DlinkDGS_1100_06MESwitchInterface = 10,
  DlinkDGS_3627GSwitchInterface = 11
}

// IDevice
export interface IDevice {
  pk: number
  ip_address: string
  mac_addr: string
  comment: string
  dev_type: IDeviceTypeEnum
  dev_type_str: string
  man_passw: string
  group: number
  parent_dev: number
  snmp_extra: string
  extra_data: object
  vlans: number[]
  status: number
  is_noticeable: boolean
}

export interface IDRFRequestListParametersDevGroup extends IDRFRequestListParameters {
  group: number
}

export type IDeviceList = IDRFListResponse<IDevice>
export type IDeviceAxoisResponsePromise = IDRFAxiosResponsePromise<IDevice>
export type IDeviceListAxiosResponsePromise = IDRFAxiosResponsePromise<IDeviceList>

// IPort
export enum IOperatingModes {
  NOT_CHOSEN = 0,
  ACCESS = 1,
  TRUNK = 2,
  HYBRID = 3,
  GENERAL = 4
}

export interface IPort {
  id: number
  device: number
  num: number
  descr: string
  operating_mode: IOperatingModes.NOT_CHOSEN
  vlans: number[]
}
export type IPortList = IDRFListResponse<IPort>
export type IPortAxoisResponsePromise = IDRFAxiosResponsePromise<IPort>
export type IPortListAxiosResponsePromise = IDRFAxiosResponsePromise<IPortList>

// IDevPorts
export interface IDevGroup {
  pk: number
  title: string
  device_count: number
}

export type IDevGroupList = IDRFListResponse<IDevGroup>
export type IDevGroupListAxiosResponsePromise = IDRFAxiosResponsePromise<IDevGroupList>
