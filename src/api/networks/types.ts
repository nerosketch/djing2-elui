/* eslint-disable camelcase */
import { IDRFAxiosResponsePromise, IDRFListResponse } from '@/api/types'

export interface IVlanIf {
  id: number
  title: string
  vid: number
  is_management: boolean
  sites?: number[]
}

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
  mac_address: string
  pool: number | null
  customer: number
  is_dynamic: boolean
  input_octets: number
  output_octets: number
  input_packets: number
  output_packets: number
  h_input_octets: string
  h_output_octets: string
  h_input_packets: string
  h_output_packets: string
  cvid: number
  svid: number
  lease_state: boolean | null
  lease_time: string
  last_update: string
  session_id: string | null
  radius_username: string | null
}
export type ICustomerIpLeaseList = IDRFListResponse<ICustomerIpLease>
export type ICustomerIpLeasePlainListResponsePromise = IDRFAxiosResponsePromise<ICustomerIpLease[]>
export type ICustomerIpLeaseListAxiosResponsePromise = IDRFAxiosResponsePromise<ICustomerIpLeaseList>
export type ICustomerIpLeaseMixList = ICustomerIpLeaseListAxiosResponsePromise | ICustomerIpLeasePlainListResponsePromise

export interface ICustomerIpLeasePingResponse {
  text: string
  status: boolean
}
export type ICustomerIpLeasePingAxoisResponsePromise = IDRFAxiosResponsePromise<ICustomerIpLeasePingResponse>
