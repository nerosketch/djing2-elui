/* eslint-disable camelcase */
import { AxiosPromise } from 'axios'
import {
  IDRFAxiosResponsePromise,
  IDRFListResponse,
  IDRFRequestListParameters,
  ISimpleResponseResult
} from '@/api/types'

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
  DlinkDGS_3627GSwitchInterface = 11,
  HuaweiS5300_10P_LI_ACInterface = 12
}

export interface IDeviceInterface extends IDevice {
  ScanAllDevVlans(devId: number): Promise<IDevVlan[]>
  ScanAllDevMac(devId: number, vid: number): Promise<IDevMacPort[]>
  ScanOltFibers(devId: number): Promise<IDevFiber[]>
  ScanPorts(devId: number): Promise<ISimpleScanPortsResponseResult>
  ScanUnitsUnregistered(devId: number): Promise<IUnitUnregistered[]>
}

export type IDeviceList = IDRFListResponse<IDevice>
export type IDeviceListAxiosResponsePromise = IDRFAxiosResponsePromise<IDeviceList>

export enum IDevPortState {
  UP = 'up',
  DOWN = 'down'
}
export interface IPort {
  id: number
  device: number
  num: number
  descr: string
  user_count: number
}

export interface IDevTogglePortRequest {
  port_state: IDevPortState
  port_snmp_num: number
}

export interface IScannedPort {
  num: number
  snmp_num: number
  name: string
  status: boolean
  mac_addr: string
  speed: number
  uptime: string
}
export interface ISimpleScanPortsResponseResult extends ISimpleResponseResult {
  ports: IScannedPort[]
}
export type IScannedPortAxiosPromise = AxiosPromise<ISimpleScanPortsResponseResult>

export interface IScannedONU {
  number: number
  title: string
  status: boolean
  mac_addr: string
  signal: number
  uptime: string
  fiberid: number
}

export enum IScannedZTEONUState {
  OK = 'ok',
  DOWN = 'down',
  UNKNOWN = 'unknown'
}

export interface IScannedZTEONU {
  onu_type: string
  onu_port: string
  onu_signal: number
  onu_sn: string
  snmp_extra: string
  onu_state: IScannedZTEONUState
}
export type IScannedZTEONUListAxiosPromise = AxiosPromise<IScannedZTEONU[]>

export enum IOnuDetailsStatus {
  UNKNOWN = 'unknown',
  UP = 'ok',
  DOWN = 'down'
}
export interface IOnuDetails {
  status: IOnuDetailsStatus
  signal: number
  mac: string
  info: Array<Array<string>>
}

export interface IUnitUnregistered {
  mac: string
  firmware_ver?: string
  loid_passw?: string
  loid?: string
  sn: string
}
export type IUnitUnregisteredListAxiosPromise = AxiosPromise<IUnitUnregistered[]>

export interface IDeviceTypeName {
  nm: string,
  v: number
}
export type IDeviceTypeNameListAxiosPromise = AxiosPromise<IDeviceTypeName[]>

export interface IDevVlan {
  vid: number
  title: string
  native: boolean
  is_management: boolean
}
export type IDevVlanListAxiosResponsePromise = AxiosPromise<IDevVlan[]>

export interface IDevVlanSimple {
  vid: number
  native: boolean
}
// Vlan onu info for one port.
// Port number it is an array index
export interface IDevVlanSimpleInfo {
  port: number
  vids: IDevVlanSimple[]
}
export type IDevVlanSimpleInfoAxiosResponsePromise = AxiosPromise<IDevVlanSimpleInfo[]>
export interface IDeviceOnuConfigTemplate {
  configTypeCode: string
  vlanConfig: IDevVlanSimpleInfo[]
}

export enum IDeviceSwitchPortConfigChoicesEnum {
  TRUNK = 'trunk',
  ACCESS = 'access'
}

export interface IDeviceSwitchPortConfigTemplate extends IDevVlanSimpleInfo {
  config_mode: IDeviceSwitchPortConfigChoicesEnum
}

export interface IDevMacPort {
  vid: number
  name: string
  mac: string
  port: number
}
export type IDevMacPortListAxiosResponsePromise = AxiosPromise<IDevMacPort[]>

export interface IDevFiber {
  fb_id: number
  fb_name: string
  fb_onu_num: number
  fb_active_onu: number
}
export type IDevFiberListAxiosResponsePromise = AxiosPromise<IDevFiber[]>

export interface IDevConfigChoice {
  title: string
  code: string
  accept_vlan: boolean
}

export interface IOnuConfigOptions {
  port_num: number
  config_choices: IDevConfigChoice[]
}
export type IOnuConfigOptionsAxiosResponsePromise = IDRFAxiosResponsePromise<IOnuConfigOptions>

export interface IDevice {
  id: number
  ip_address: string
  mac_addr: string
  comment: string
  iface_name?: string
  dev_type: IDeviceTypeEnum
  dev_type_str?: string
  man_passw: string
  group: number
  parent_dev: number
  parent_dev_name?: string
  snmp_extra: string
  extra_data: object
  vlans: number[]
  status: number
  is_noticeable: boolean
  code: string
  sites?: number[]
  create_time: string
  address: number
  address_title: string
}
export interface IDeviceInterace extends IDevice {
  ScanAllDevVlans(devId: number): Promise<IDevVlan[]>
  ScanAllDevMac(devId: number, vid: number): Promise<IDevMacPort[]>
  ScanOltFibers(devId: number): Promise<IDevFiber[]>
  ScanPorts(devId: number): Promise<IScannedPort[]>
  ScanUnitsUnregistered(devId: number): Promise<IUnitUnregistered[]>
}

export interface IDRFRequestListParametersDevGroup extends IDRFRequestListParameters {
  address: number | null
}

export interface IFixOnuSimpleResponseResult extends ISimpleResponseResult {
  device: IDevice
}
export type IFixOnuSimpleResponseResultAxiosResponsePromise = IDRFAxiosResponsePromise<IFixOnuSimpleResponseResult>
