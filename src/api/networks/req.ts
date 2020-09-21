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
  ICustomerIpLeaseListAxiosResponsePromise,
  ICustomerIpLeasePingAxoisResponsePromise,
  ICustomerIpLeasePlainListResponsePromise
} from './types'

const baseVlanUrl = '/networks/vlan/'

// VlanIf
export const getVlans = (params?: IDRFRequestListParameters): IVlanIfListAxiosResponsePromise =>
  request.get<IVlanIfList>(baseVlanUrl, { params })

export const getVlanIf = (vlanId: number): IVlanIfAxoisResponsePromise =>
  request.get<IVlanIf>(`${baseVlanUrl}${vlanId}/`)

export const addVlanIf = (newVlan: object): IVlanIfAxoisResponsePromise =>
  request.post<IVlanIf>(baseVlanUrl, newVlan)

export const changeVlanIf = (vlanId: number, newData: object): IVlanIfAxoisResponsePromise =>
  request.patch<IVlanIf>(`${baseVlanUrl}${vlanId}/`, newData)

export const delVlanIf = (vlanId: number) =>
  request.delete(`${baseVlanUrl}${vlanId}/`)

const baseNetUrl = '/networks/pool/'

// NetworkIpPool
export const getNetworkIpPools = (params?: object): INetworkIpPoolListAxiosResponsePromise =>
  request.get<INetworkIpPoolList>(baseNetUrl, { params })

export const getNetworkIpPool = (poolId: number): INetworkIpPoolAxoisResponsePromise =>
  request.get<INetworkIpPool>(`${baseNetUrl}${poolId}/`)

export const addNetworkIpPool = (newPool: object): INetworkIpPoolAxoisResponsePromise =>
  request.post<INetworkIpPool>(baseNetUrl, newPool)

export const changeNetworkIpPool = (poolId: number, newData: object): INetworkIpPoolAxoisResponsePromise =>
  request.patch<INetworkIpPool>(`${baseNetUrl}${poolId}/`, newData)

export const delNetworkIpPool = (poolId: number) =>
  request.delete(`${baseNetUrl}${poolId}/`)

export const groupAttach = (poolId: number, groups: number[]) =>
  request.post(`${baseNetUrl}${poolId}/group_attach/`, { gr: groups })

export const getFreeIP = (id: number) =>
  request.get(`${baseNetUrl}${id}/get_free_ip/`)

const baseLeaseUrl = '/networks/lease/'

// CustomerIpLease
export const getCustomerIpLeases = (params?: IDRFRequestListParameters, customer?: number): ICustomerIpLeaseListAxiosResponsePromise | ICustomerIpLeasePlainListResponsePromise => {
  if (customer) {
    params = Object.assign({ customer }, params)
  }
  return request.get<ICustomerIpLeaseList>(baseLeaseUrl, { params })
}

export const getCustomerIpLease = (leaseId: number): ICustomerIpLeaseAxoisResponsePromise =>
  request.get<ICustomerIpLease>(`${baseLeaseUrl}${leaseId}/`)

export const addCustomerIpLease = (newLease: object): ICustomerIpLeaseAxoisResponsePromise =>
  request.post<ICustomerIpLease>(baseLeaseUrl, newLease)

export const changeCustomerIpLease = (leaseId: number, newData: object): ICustomerIpLeaseAxoisResponsePromise =>
  request.patch<ICustomerIpLease>(`${baseLeaseUrl}${leaseId}/`, newData)

export const delCustomerIpLease = (leaseId: number) =>
  request.delete(`${baseLeaseUrl}${leaseId}/`)

export const pingIcmpIpLease = (leaseId: number): ICustomerIpLeasePingAxoisResponsePromise =>
  request.get(`${baseLeaseUrl}${leaseId}/ping_ip/`)
