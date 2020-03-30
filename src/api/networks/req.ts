import request from '@/utils/request'
import { IDRFRequestListParameters } from '@/api/types'
import {
  IVlanIf, IVlanIfList, IVlanIfListAxiosResponsePromise,
  IVlanIfAxoisResponsePromise,
  INetworkIpPool,
  INetworkIpPoolList, INetworkIpPoolAxoisResponsePromise,
  INetworkIpPoolListAxiosResponsePromise,
  ICustomerIpLease, ICustomerIpLeaseList,
  ICustomerIpLeaseAxoisResponsePromise,
  ICustomerIpLeaseListAxiosResponsePromise
} from './types'

// VlanIf
export const getVlans = (params: IDRFRequestListParameters): IVlanIfListAxiosResponsePromise =>
  request.get<IVlanIfList>('/networks/vlan/', { params })

export const getVlanIf = (vlanId: number): IVlanIfAxoisResponsePromise =>
  request.get<IVlanIf>(`/networks/vlan/${vlanId}/`)

export const addVlanIf = (newVlan: IVlanIf): IVlanIfAxoisResponsePromise =>
  request.post<IVlanIf>('/networks/vlan/', newVlan)

export const changeVlanIf = (vlanId: number, newData: IVlanIf): IVlanIfAxoisResponsePromise =>
  request.put<IVlanIf>(`/networks/vlan/${vlanId}/`, newData)

export const delVlanIf = (vlanId: number) =>
  request({
    url: `/networks/vlan/${vlanId}/`,
    method: 'delete'
  })


// NetworkIpPool
export const getNetworkIpPools = (params: IDRFRequestListParameters): INetworkIpPoolListAxiosResponsePromise =>
  request.get<INetworkIpPoolList>('/networks/vlan/', { params })

export const getNetworkIpPool = (vlanId: number): INetworkIpPoolAxoisResponsePromise =>
  request.get<INetworkIpPool>(`/networks/vlan/${vlanId}/`)

export const addNetworkIpPool = (newVlan: IVlanIf): INetworkIpPoolAxoisResponsePromise =>
  request.post<INetworkIpPool>('/networks/vlan/', newVlan)

export const changeNetworkIpPool = (vlanId: number, newData: IVlanIf): INetworkIpPoolAxoisResponsePromise =>
  request.put<INetworkIpPool>(`/networks/vlan/${vlanId}/`, newData)

export const delNetworkIpPool = (vlanId: number) =>
  request({
    url: `/networks/vlan/${vlanId}/`,
    method: 'delete'
  })


// CustomerIpLease
export const getCustomerIpLeases = (params: IDRFRequestListParameters): ICustomerIpLeaseListAxiosResponsePromise =>
  request.get<ICustomerIpLeaseList>('/networks/vlan/', { params })

export const getCustomerIpLease = (vlanId: number): ICustomerIpLeaseAxoisResponsePromise =>
  request.get<ICustomerIpLease>(`/networks/vlan/${vlanId}/`)

export const addCustomerIpLease = (newVlan: ICustomerIpLease): ICustomerIpLeaseAxoisResponsePromise =>
  request.post<ICustomerIpLease>('/networks/vlan/', newVlan)

export const changeCustomerIpLease = (vlanId: number, newData: ICustomerIpLease): ICustomerIpLeaseAxoisResponsePromise =>
  request.put<ICustomerIpLease>(`/networks/vlan/${vlanId}/`, newData)

export const delCustomerIpLease = (vlanId: number) =>
  request({
    url: `/networks/vlan/${vlanId}/`,
    method: 'delete'
  })
