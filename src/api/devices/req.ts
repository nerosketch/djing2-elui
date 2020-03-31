import request from '@/utils/request'
import { IDRFRequestListParameters } from '@/api/types'
import {
  IDevice, IDeviceList, IDeviceAxoisResponsePromise,
  IDeviceListAxiosResponsePromise,
  IPort, IPortList, IPortAxoisResponsePromise,
  IPortListAxiosResponsePromise,
  IDevGroupList, IDevGroupListAxiosResponsePromise,
  IDRFRequestListParametersDevGroup
} from './types'

const baseDevUrl = '/devices/'

// IDevice
export const getDevices = (params: IDRFRequestListParametersDevGroup): IDeviceListAxiosResponsePromise =>
  request.get<IDeviceList>(baseDevUrl, { params })

export const getDevice = (devId: number): IDeviceAxoisResponsePromise =>
  request.get<IDevice>(`${baseDevUrl}${devId}/`)

export const addDevice = (newVlan: IDevice): IDeviceAxoisResponsePromise =>
  request.post<IDevice>(baseDevUrl, newVlan)

export const changeDevice = (vlanId: number, newData: IDevice): IDeviceAxoisResponsePromise =>
  request.put<IDevice>(`${baseDevUrl}${vlanId}/`, newData)

export const delDevice = (vlanId: number) =>
  request.delete(`${baseDevUrl}${vlanId}/`)

// IPort
const basePortUrl = '/devices/ports/'

export const getPorts = (params?: IDRFRequestListParameters): IPortListAxiosResponsePromise =>
  request.get<IPortList>(basePortUrl, { params })

export const getPort = (devId: number): IPortAxoisResponsePromise =>
  request.get<IPort>(`${basePortUrl}${devId}/`)

export const addPort = (newDev: IDevice): IPortAxoisResponsePromise =>
  request.post<IPort>(basePortUrl, newDev)

export const changePort = (portId: number, newData: IDevice): IPortAxoisResponsePromise =>
  request.put<IPort>(`${basePortUrl}${portId}/`, newData)

export const delPort = (vlanId: number) =>
  request.delete(`${basePortUrl}${vlanId}/`)

// IDevGroup
export const getDevGroups = (params?: IDRFRequestListParameters): IDevGroupListAxiosResponsePromise =>
  request.get<IDevGroupList>('/devices/groups/', { params })
