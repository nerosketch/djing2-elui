/* eslint-disable camelcase */
import { IDRFAxiosResponsePromise, IDRFListResponse } from '@/api/types'

export interface IVlanIf {
  id: number
  title: string
  vid: number
  is_management: boolean
  sites?: number[]
}

export type IVlanIfList = IDRFListResponse<IVlanIf>
export type IVlanIfAxoisResponsePromise = IDRFAxiosResponsePromise<IVlanIf>
export type IVlanIfListAxiosResponsePromise = IDRFAxiosResponsePromise<IVlanIfList>

export enum INetworkIpPoolKind {
  NOT_DEFINED = 0,
  INTERNET = 1,
  GUEST = 2,
  TRUST = 3,
  DEVICES = 4,
  ADMIN = 5
}

export interface INetworkIpPool {
  id: number
  network: string
  kind: INetworkIpPoolKind
  description: string
  groups: number[]
  ip_start: string
  ip_end: string
  gateway: string
  is_dynamic: boolean
  sites?: number[]
  vlan_if?: number
}
export type INetworkIpPoolList = IDRFListResponse<INetworkIpPool>
export type INetworkIpPoolAxoisResponsePromise = IDRFAxiosResponsePromise<INetworkIpPool>
export type INetworkIpPoolListAxiosResponsePromise = IDRFAxiosResponsePromise<INetworkIpPoolList>

export interface ICustomerIpLease {
  id: number
  ip_address: string
  pool: number
  customer: number
  lease_time: string
  last_update: string
  mac_address: string
  is_dynamic: boolean
}
export type ICustomerIpLeaseList = IDRFListResponse<ICustomerIpLease>
export type ICustomerIpLeaseAxoisResponsePromise = IDRFAxiosResponsePromise<ICustomerIpLease>
export type ICustomerIpLeasePlainListResponsePromise = IDRFAxiosResponsePromise<ICustomerIpLease[]>
export type ICustomerIpLeaseListAxiosResponsePromise = IDRFAxiosResponsePromise<ICustomerIpLeaseList>

export interface ICustomerIpLeasePingResponse {
  text: string
  status: boolean
}
export type ICustomerIpLeasePingAxoisResponsePromise = IDRFAxiosResponsePromise<ICustomerIpLeasePingResponse>
