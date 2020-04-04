import Axios, { AxiosPromise } from 'axios'
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
export interface IDeviceInterace extends IDevice {
  ScanAllDevVlans(devId: number): Promise<IDevVlan[]>
  ScanAllDevMac(devId: number, vid: number): Promise<IDevMacPort[]>
  ScanOltFibers(devId: number): Promise<IDevFiber[]>
  ScanPorts(devId: number): Promise<IScannedPort[]>
  ScanUnitsUnregistered(devId: number): Promise<IUnitUnregistered[]>
}

export interface IDRFRequestListParametersDevGroup extends IDRFRequestListParameters {
  group: number
}

export type IDeviceList = IDRFListResponse<IDevice>
export type IDeviceAxoisResponsePromise = IDRFAxiosResponsePromise<IDevice>
export type IDeviceListAxiosResponsePromise = IDRFAxiosResponsePromise<IDeviceList>

// IPort
export enum IDevPortState {
  UP = 'up',
  DOWN = 'down'
}
export interface IPort {
  pk: number
  device: number
  num: number
  descr: string
  user_count: number
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

export interface IPortVlanConfigMember {
  vid: number
  title: string
  is_management?: boolean
  native: boolean
}
export interface IPortVlanConfig {
  port_num: number
  vlans: IPortVlanConfigMember[]
}

// IScannedPort
export interface IScannedPort {
  num: number
  snmp_number: number
  name: string
  status: boolean
  mac_addr: string
  speed: number
  uptime: string
  user_count?: number
}
export type IScannedPortListAxiosPromise = AxiosPromise<IScannedPort[]>

// IUnitUnregistered
export interface IUnitUnregistered {
  mac: string
  firmware_ver?: string
  loid_passw?: string
  loid?: string
  sn: string
}
export type IUnitUnregisteredListAxiosPromise = AxiosPromise<IUnitUnregistered[]>

// IDevVlan
export interface IDevVlan {
  vid: number
  title: string
  native: boolean
  is_management: boolean
}
export type IDevVlanListAxiosResponsePromise = AxiosPromise<IDevVlan[]>

// IDevMacPort
export interface IDevMacPort {
  vid: number
  name: string
  mac: string
  port: number
}
export type IDevMacPortListAxiosResponsePromise = AxiosPromise<IDevMacPort[]>

// IDevFiber
export interface IDevFiber {
  fb_id: number
  fb_name: string
  fb_onu_num: number
}
export type IDevFiberListAxiosResponsePromise = AxiosPromise<IDevFiber[]>
