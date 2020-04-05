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

const baseVlanUrl = '/networks/vlan/'

// VlanIf
export const getVlans = (params?: IDRFRequestListParameters): IVlanIfListAxiosResponsePromise =>
  request.get<IVlanIfList>(baseVlanUrl, { params })

export const getVlanIf = (vlanId: number): IVlanIfAxoisResponsePromise =>
  request.get<IVlanIf>(`${baseVlanUrl}${vlanId}/`)

export const addVlanIf = (newVlan: IVlanIf): IVlanIfAxoisResponsePromise =>
  request.post<IVlanIf>(baseVlanUrl, newVlan)

export const changeVlanIf = (vlanId: number, newData: IVlanIf): IVlanIfAxoisResponsePromise =>
  request.patch<IVlanIf>(`${baseVlanUrl}${vlanId}/`, newData)

export const delVlanIf = (vlanId: number) =>
  request.delete(`${baseVlanUrl}${vlanId}/`)

const baseNetUrl = '/networks/pool/'

// NetworkIpPool
export const getNetworkIpPools = (params?: IDRFRequestListParameters): INetworkIpPoolListAxiosResponsePromise =>
  request.get<INetworkIpPoolList>(baseNetUrl, { params })

export const getNetworkIpPool = (poolId: number): INetworkIpPoolAxoisResponsePromise =>
  request.get<INetworkIpPool>(`${baseNetUrl}${poolId}/`)

export const addNetworkIpPool = (newPool: INetworkIpPool): INetworkIpPoolAxoisResponsePromise =>
  request.post<INetworkIpPool>(baseNetUrl, newPool)

export const changeNetworkIpPool = (poolId: number, newData: INetworkIpPool): INetworkIpPoolAxoisResponsePromise =>
  request.patch<INetworkIpPool>(`${baseNetUrl}${poolId}/`, newData)

export const delNetworkIpPool = (poolId: number) =>
  request.delete(`${baseNetUrl}${poolId}/`)

export const groupAttach = (poolId: number, groups: number[]) =>
  request.post(`${baseNetUrl}${poolId}/`, { gr: groups })

const baseLeaseUrl = '/networks/lease/'

// CustomerIpLease
export const getCustomerIpLeases = (params?: IDRFRequestListParameters): ICustomerIpLeaseListAxiosResponsePromise =>
  request.get<ICustomerIpLeaseList>(baseLeaseUrl, { params })

export const getCustomerIpLease = (leaseId: number): ICustomerIpLeaseAxoisResponsePromise =>
  request.get<ICustomerIpLease>(`${baseLeaseUrl}${leaseId}/`)

export const addCustomerIpLease = (newLease: ICustomerIpLease): ICustomerIpLeaseAxoisResponsePromise =>
  request.post<ICustomerIpLease>(baseLeaseUrl, newLease)

export const changeCustomerIpLease = (leaseId: number, newData: ICustomerIpLease): ICustomerIpLeaseAxoisResponsePromise =>
  request.patch<ICustomerIpLease>(`${baseLeaseUrl}${leaseId}/`, newData)

export const delCustomerIpLease = (leaseId: number) =>
  request.delete(`${baseLeaseUrl}${leaseId}/`)
