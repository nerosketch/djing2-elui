import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import {
  IDRFRequestListParameters,
  ISimpleResponseResultAxiosResponsePromise,
  IObjectGroupPermsInitial,
  IObjectGroupPermsInitialAxiosResponsePromise,
  IObjectGroupPermsResultStruct
} from '@/api/types'
import {
  IDevice, IDeviceList, IDeviceAxoisResponsePromise,
  IDeviceListAxiosResponsePromise,
  IPort, IPortAxoisResponsePromise,
  IDevGroupList, IDevGroupListAxiosResponsePromise,
  IDRFRequestListParametersDevGroup,
  IDevPortState, IDevMacPort, IDevMacPortListAxiosResponsePromise,
  IDevVlan, IDevVlanListAxiosResponsePromise,
  IDevFiber, IDevFiberListAxiosResponsePromise,
  IScannedPort, IScannedPortListAxiosPromise,
  IUnitUnregistered, IUnitUnregisteredListAxiosPromise,
  IScannedZTEONUListAxiosPromise, IScannedZTEONU,
  IOnuConfigOptions, IOnuConfigOptionsAxiosResponsePromise,
  IDevOnuVlanInfoAxiosResponsePromise, IDevOnuVlanInfo,
  IDeviceOnuConfigTemplate, IFixOnuSimpleResponseResultAxiosResponsePromise
} from './types'

const baseDevUrl = '/devices/'

// IDevice
export const getDevices = (params: IDRFRequestListParametersDevGroup): IDeviceListAxiosResponsePromise =>
  request.get<IDeviceList>(baseDevUrl, { params })

export const getDevice = (devId: number): IDeviceAxoisResponsePromise =>
  request.get<IDevice>(`${baseDevUrl}${devId}/`)

export const findDevices = (devtext: string): IDeviceListAxiosResponsePromise =>
  request.get<IDeviceList>(baseDevUrl, { params: {
    search: devtext,
    page_size: 30,
    fields: 'pk,comment'
  } })

export const addDevice = (newDev: object): IDeviceAxoisResponsePromise =>
  request.post<IDevice>(baseDevUrl, newDev)

export const changeDevice = (devId: number, newData: object): IDeviceAxoisResponsePromise =>
  request.patch<IDevice>(`${baseDevUrl}${devId}/`, newData)

export const delDevice = (devId: number) =>
  request.delete(`${baseDevUrl}${devId}/`)

export const scanAllDevVlans = (devId: number): IDevVlanListAxiosResponsePromise =>
  request.get<IDevVlan[]>(`${baseDevUrl}${devId}/scan_all_vlan_list/`)

export const readOnuVlanInfo = (devId: number): IDevOnuVlanInfoAxiosResponsePromise =>
  request.get<IDevOnuVlanInfo[]>(`${baseDevUrl}pon/${devId}/read_onu_vlan_info/`)

export const scanAllDevMac = (devId: number, vid: number): IDevMacPortListAxiosResponsePromise =>
  request.get<IDevMacPort[]>(`${baseDevUrl}${devId}/scan_mac_address_vlan/`, { params: { vid } })

export const removeFromOlt = (devId: number): ISimpleResponseResultAxiosResponsePromise =>
  request.get(`${baseDevUrl}pon/${devId}/remove_from_olt/`)

export const getDeviceConfigChoices = (devId: number): IOnuConfigOptionsAxiosResponsePromise =>
  request.get<IOnuConfigOptions>(`${baseDevUrl}pon/${devId}/get_onu_config_options/`)

export const applyDeviceOnuConfig = (devId: number, devConfig: IDeviceOnuConfigTemplate) =>
  request.post(`${baseDevUrl}pon/${devId}/apply_device_onu_config_template/`, devConfig)

export const fixOnu = (devId: number): IFixOnuSimpleResponseResultAxiosResponsePromise =>
  request.get(`${baseDevUrl}pon/${devId}/fix_onu/`)

export const sendReboot = (devId: number) =>
  request.put(`${baseDevUrl}${devId}/send_reboot/`)

export const scanOltFibers = (devId: number): IDevFiberListAxiosResponsePromise =>
  request.get<IDevFiber[]>(`${baseDevUrl}pon/${devId}/scan_olt_fibers/`)

export const scanFiberOnuList = (devId: number, fiberNum: number): IScannedZTEONUListAxiosPromise =>
  request.get<IScannedZTEONU[]>(`${baseDevUrl}pon/${devId}/scan_onu_on_fiber/${fiberNum}/`)

export const scanPonDetails = (devId: number) =>
  request.get(`${baseDevUrl}pon/${devId}/scan_pon_details/`)

export const scanPorts = (devId: number): IScannedPortListAxiosPromise =>
  request.get<IScannedPort[]>(`${baseDevUrl}${devId}/scan_ports/`)

export const scanOnuList = (devId: number, onProgress: (c: ProgressEvent) => void): AxiosPromise<string> =>
  request.get(`${baseDevUrl}pon/${devId}/scan_onu_list/`, { onDownloadProgress: onProgress })

export const scanUnitsUnregistered = (devId: number): IUnitUnregisteredListAxiosPromise =>
  request.get<IUnitUnregistered[]>(`${baseDevUrl}pon/${devId}/scan_units_unregistered/`)

// IPort
const basePortUrl = '/devices/ports/'

export const getPorts = (devId: number, portNum?: number): AxiosPromise<IPort[]> =>
  request.get<IPort[]>(basePortUrl, { params: { device: devId, num: portNum } })

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

// export const vlanConfigApply = (portId: number, conf: IPortVlanConfig) =>
//   request.post(`${basePortUrl}${portId}/`, conf)

// IDevGroup
export const getDevGroups = (params?: IDRFRequestListParameters): IDevGroupListAxiosResponsePromise =>
  request.get<IDevGroupList>('/devices/groups/', { params })

export const getDevObjectsPerms = (devId: number): IObjectGroupPermsInitialAxiosResponsePromise =>
  request.get<IObjectGroupPermsInitial>(`/devices/${devId}/get_object_perms/`)

export const setDevObjectsPerms = (devId: number, dat: IObjectGroupPermsResultStruct) =>
  request.put(`/devices/${devId}/set_object_perms/`, dat)

export const getDeviceSelectedObjectPerms = (devId: number, profileGroupId: number): AxiosPromise<number[]> =>
  request.get(`/devices/${devId}/get_selected_object_perms/${profileGroupId}/`)
