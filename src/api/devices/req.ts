import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { IDRFRequestListParameters } from '@/api/types'
import {
  IDevice, IDeviceList, IDeviceAxoisResponsePromise,
  IDeviceListAxiosResponsePromise,
  IPort, IPortList, IPortAxoisResponsePromise,
  IPortListAxiosResponsePromise,
  IDevGroupList, IDevGroupListAxiosResponsePromise,
  IDRFRequestListParametersDevGroup,
  IDevPortState, IDevMacPort, IDevMacPortListAxiosResponsePromise,
  IDevVlan, IDevVlanListAxiosResponsePromise, IPortVlanConfig,
  IDevFiber, IDevFiberListAxiosResponsePromise,
  IScannedPort, IScannedPortListAxiosPromise,
  IUnitUnregistered, IUnitUnregisteredListAxiosPromise,
  IOnuDetails, IOnuDetailsAxiosPromise
} from './types'

const baseDevUrl = '/devices/'

// IDevice
export const getDevices = (params: IDRFRequestListParametersDevGroup): IDeviceListAxiosResponsePromise =>
  request.get<IDeviceList>(baseDevUrl, { params })

export const getDevice = (devId: number): IDeviceAxoisResponsePromise =>
  request.get<IDevice>(`${baseDevUrl}${devId}/`)

export const addDevice = (newDev: object): IDeviceAxoisResponsePromise =>
  request.post<IDevice>(baseDevUrl, newDev)

export const changeDevice = (devId: number, newData: object): IDeviceAxoisResponsePromise =>
  request.patch<IDevice>(`${baseDevUrl}${devId}/`, newData)

export const delDevice = (devId: number) =>
  request.delete(`${baseDevUrl}${devId}/`)

export const scanAllDevVlans = (devId: number): IDevVlanListAxiosResponsePromise =>
  request.get<IDevVlan[]>(`${baseDevUrl}${devId}/scan_all_vlan_list/`)

export const scanAllDevMac = (devId: number, vid: number): IDevMacPortListAxiosResponsePromise =>
  request.get<IDevMacPort[]>(`${baseDevUrl}${devId}/scan_mac_address_vlan/`, { params: { vid } })

export const removeFromOlt = (devId: number) =>
  request.get(`${baseDevUrl}${devId}/remove_from_olt/`)

export const registerDevice = (devId: number) =>
  request.get(`${baseDevUrl}${devId}/register_device/`)

export const fixOnu = (devId: number) =>
  request.get(`${baseDevUrl}${devId}/fix_onu/`)

export const sendReboot = (devId: number) =>
  request.put(`${baseDevUrl}${devId}/send_reboot/`)

export const scanOltFibers = (devId: number): IDevFiberListAxiosResponsePromise =>
  request.get<IDevFiber[]>(`${baseDevUrl}${devId}/scan_olt_fibers/`)

export const scanDetails = (devId: number): IOnuDetailsAxiosPromise =>
  request.get<IOnuDetails>(`${baseDevUrl}${devId}/scan_details/`)

export const scanPorts = (devId: number): IScannedPortListAxiosPromise =>
  request.get<IScannedPort[]>(`${baseDevUrl}${devId}/scan_ports/`)

export const scanOnuList = (devId: number, onProgress: (c: ProgressEvent) => void): AxiosPromise<string> =>
  request.get(`${baseDevUrl}${devId}/scan_onu_list/`, { onDownloadProgress: onProgress })

export const scanUnitsUnregistered = (devId: number): IUnitUnregisteredListAxiosPromise =>
  request.get<IUnitUnregistered[]>(`${baseDevUrl}${devId}/scan_units_unregistered/`)

// IPort
const basePortUrl = '/devices/ports/'

export const getPorts = (devId: number, portNum?: number): IPortListAxiosResponsePromise =>
  request.get<IPortList>(basePortUrl, { params: { device: devId, num: portNum } })

export const getPort = (portId: number): IPortAxoisResponsePromise =>
  request.get<IPort>(`${basePortUrl}${portId}/`)

export const addPort = (newPort: object): IPortAxoisResponsePromise =>
  request.post<IPort>(basePortUrl, newPort)

export const changePort = (portId: number, newData: object): IPortAxoisResponsePromise =>
  request.patch<IPort>(`${basePortUrl}${portId}/`, newData)

export const delPort = (portId: number) =>
  request.delete(`${basePortUrl}${portId}/`)

export const togglePort = (portId: number, pstate: IDevPortState) =>
  request.get(`${basePortUrl}${portId}/toggle_port/`, { params: { port_state: pstate } })

export const scanMacAddressPort = (portId: number): IDevMacPortListAxiosResponsePromise =>
  request.get<IDevMacPort[]>(`${basePortUrl}${portId}/scan_mac_address_port/`)

export const scanPortVlans = (portId: number): IDevVlanListAxiosResponsePromise =>
  request.get<IDevVlan[]>(`${basePortUrl}${portId}/scan_vlan/`)

export const vlanConfigApply = (portId: number, conf: IPortVlanConfig) =>
  request.post(`${basePortUrl}${portId}/`, conf)

// IDevGroup
export const getDevGroups = (params?: IDRFRequestListParameters): IDevGroupListAxiosResponsePromise =>
  request.get<IDevGroupList>('/devices/groups/', { params })
