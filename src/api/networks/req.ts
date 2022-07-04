import request from '@/utils/request'
import { IDRFAxiosResponsePromise, IDRFRequestListParameters } from '@/api/types'
import {
  IVlanIf,
  INetworkIpPool,
  INetworkIpPoolList,
  INetworkIpPoolListAxiosResponsePromise,
  ICustomerIpLease, ICustomerIpLeaseList,
  ICustomerIpLeaseListAxiosResponsePromise,
  ICustomerIpLeasePingAxoisResponsePromise,
  ICustomerIpLeasePlainListResponsePromise
} from './types'
import {
  addObjectDecorator,
  delObjectDecorator,
  getObjectDecorator,
  getObjectListDecorator,
  patchObjectDecorator
} from '@/api/baseRequests'


// VlanIf
const baseVlanUrl = '/networks/vlan/'
export const getVlans = getObjectListDecorator<IVlanIf>(baseVlanUrl)
export const getVlanIf = getObjectDecorator<IVlanIf>(baseVlanUrl)
export const addVlanIf = addObjectDecorator<IVlanIf>(baseVlanUrl)
export const changeVlanIf = patchObjectDecorator<IVlanIf>(baseVlanUrl)
export const delVlanIf = delObjectDecorator<IVlanIf>(baseVlanUrl)


// NetworkIpPool
const baseNetUrl = '/networks/pool/'

// NetworkIpPool
export const getNetworkIpPools = (params?: object): INetworkIpPoolListAxiosResponsePromise =>
  request.get<INetworkIpPoolList>(baseNetUrl, { params })

export const getNetworkIpPool = getObjectDecorator<INetworkIpPool>(baseNetUrl)
export const addNetworkIpPool = addObjectDecorator<INetworkIpPool>(baseNetUrl)
export const changeNetworkIpPool = patchObjectDecorator<INetworkIpPool>(baseNetUrl)
export const delNetworkIpPool = delObjectDecorator<INetworkIpPool>(baseNetUrl)

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

export const getCustomerIpLease = getObjectDecorator<ICustomerIpLease>(baseLeaseUrl)
export const addCustomerIpLease = addObjectDecorator<ICustomerIpLease>(baseLeaseUrl)
export const changeCustomerIpLease = patchObjectDecorator<ICustomerIpLease>(baseLeaseUrl)
export const delCustomerIpLease = delObjectDecorator<ICustomerIpLease>(baseLeaseUrl)

export const pingIcmpIpLease = (leaseId: number): ICustomerIpLeasePingAxoisResponsePromise =>
  request.get(`${baseLeaseUrl}${leaseId}/ping_ip/`)

export const freeLeaseSession = (leaseId: number): IDRFAxiosResponsePromise<string> =>
  request.get(`${baseLeaseUrl}${leaseId}/free_session/`)
