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
  IDevMacPort, IDevMacPortListAxiosResponsePromise,
  IDevVlan, IDevVlanListAxiosResponsePromise,
  IDevFiber, IDevFiberListAxiosResponsePromise,
  IScannedPort, IScannedPortListAxiosPromise,
  IUnitUnregistered, IUnitUnregisteredListAxiosPromise,
  IScannedZTEONUListAxiosPromise, IScannedZTEONU,
  IOnuConfigOptions, IOnuConfigOptionsAxiosResponsePromise,
  IDevVlanSimpleInfoAxiosResponsePromise, IDevVlanSimpleInfo,
  IDeviceOnuConfigTemplate, IFixOnuSimpleResponseResultAxiosResponsePromise,
  IDevTogglePortRequest,
  IDeviceTypeNameListAxiosPromise,
  IDeviceTypeName,
} from './types'

const baseDevUrl = '/devices/all/'

// IDevice
export const getDevices = (params: IDRFRequestListParametersDevGroup): IDeviceListAxiosResponsePromise =>
  request.get<IDeviceList>(baseDevUrl, { params })

export const getDevice = (devId: number): IDeviceAxoisResponsePromise =>
  request.get<IDevice>(`${baseDevUrl}${devId}/`)

export const findDevices = (devtext: string): IDeviceListAxiosResponsePromise =>
  request.get<IDeviceList>(baseDevUrl, { params: {
    search: devtext,
    page_size: 30,
    fields: 'id,comment'
  } })

export const addDevice = (newDev: object): IDeviceAxoisResponsePromise =>
  request.post<IDevice>(baseDevUrl, newDev)

export const changeDevice = (devId: number, newData: object): IDeviceAxoisResponsePromise =>
  request.patch<IDevice>(`${baseDevUrl}${devId}/`, newData)

export const delDevice = (devId: number) =>
  request.delete(`${baseDevUrl}${devId}/`)

export const scanAllDevVlans = (devId: number): IDevVlanListAxiosResponsePromise =>
  request.get<IDevVlan[]>(`${baseDevUrl}${devId}/scan_all_vlan_list/`)

const baseDevPonUrl = '/devices/pon/'

export const readOnuVlanInfo = (devId: number): IDevVlanSimpleInfoAxiosResponsePromise =>
  request.get<IDevVlanSimpleInfo[]>(`${baseDevPonUrl}${devId}/read_onu_vlan_info/`)

export const scanAllDevMac = (devId: number, vid: number): IDevMacPortListAxiosResponsePromise =>
  request.get<IDevMacPort[]>(`${baseDevUrl}${devId}/scan_mac_address_vlan/`, { params: { vid } })

export const removeFromOlt = (devId: number): ISimpleResponseResultAxiosResponsePromise =>
  request.get(`${baseDevPonUrl}${devId}/remove_from_olt/`)

export const getDeviceConfigChoices = (devId: number): IOnuConfigOptionsAxiosResponsePromise =>
  request.get<IOnuConfigOptions>(`${baseDevPonUrl}${devId}/get_onu_config_options/`)

export const applyDeviceOnuConfig = (devId: number, devConfig: IDeviceOnuConfigTemplate) =>
  request.post(`${baseDevPonUrl}${devId}/apply_device_onu_config_template/`, devConfig)

export const fixOnu = (devId: number): IFixOnuSimpleResponseResultAxiosResponsePromise =>
  request.get(`${baseDevPonUrl}${devId}/fix_onu/`)

export const sendReboot = (devId: number) =>
  request.put(`${baseDevUrl}${devId}/send_reboot/`)

export const scanOltFibers = (devId: number): IDevFiberListAxiosResponsePromise =>
  request.get<IDevFiber[]>(`${baseDevPonUrl}${devId}/scan_olt_fibers/`)

export const scanFiberOnuList = (devId: number, fiberNum: number): IScannedZTEONUListAxiosPromise =>
  request.get<IScannedZTEONU[]>(`${baseDevPonUrl}${devId}/scan_onu_on_fiber/${fiberNum}/`)

export const scanPonDetails = (devId: number) =>
  request.get(`${baseDevPonUrl}${devId}/scan_pon_details/`)

export const scanPorts = (devId: number): IScannedPortListAxiosPromise =>
  request.get<IScannedPort[]>(`${baseDevUrl}${devId}/scan_ports/`)

export const scanOnuList = (devId: number, onProgress: (c: ProgressEvent) => void): AxiosPromise<string> =>
  request.get(`${baseDevPonUrl}${devId}/scan_onu_list/`, { onDownloadProgress: onProgress })

export const scanUnitsUnregistered = (devId: number): IUnitUnregisteredListAxiosPromise =>
  request.get<IUnitUnregistered[]>(`${baseDevPonUrl}${devId}/scan_units_unregistered/`)

export const getDeviceTypes = (): IDeviceTypeNameListAxiosPromise =>
  request.get<IDeviceTypeName[]>(`${baseDevUrl}device_types/`)

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

export const togglePort = (portId: number, preq: IDevTogglePortRequest) =>
  request.get(`${basePortUrl}${portId}/toggle_port/`, { params: preq })

export const scanMacAddressPort = (portId: number): IDevMacPortListAxiosResponsePromise =>
  request.get<IDevMacPort[]>(`${basePortUrl}${portId}/scan_mac_address_port/`)

export const scanPortVlans = (portId: number): IDevVlanListAxiosResponsePromise =>
  request.get<IDevVlan[]>(`${basePortUrl}${portId}/scan_vlan/`)

// IDevGroup
export const getDevGroups = (params?: IDRFRequestListParameters): IDevGroupListAxiosResponsePromise =>
  request.get<IDevGroupList>('/devices/groups/', { params })

export const getDevObjectsPerms = (devId: number): IObjectGroupPermsInitialAxiosResponsePromise =>
  request.get<IObjectGroupPermsInitial>(`${baseDevUrl}${devId}/get_object_perms/`)

export const setDevObjectsPerms = (devId: number, dat: IObjectGroupPermsResultStruct) =>
  request.put(`${baseDevUrl}${devId}/set_object_perms/`, dat)

export const getDeviceSelectedObjectPerms = (devId: number, profileGroupId: number): AxiosPromise<number[]> =>
  request.get(`${baseDevUrl}${devId}/get_selected_object_perms/${profileGroupId}/`)
