import { IDRFAxiosResponsePromise, IDRFListResponse, IDRFRequestListParameters } from '@/api/types'
import { IGroup } from '@/api/groups/types'

// ICustomer
export interface ICustomer {
  pk: number
  username: string
  telephone: string
  fio: string
  group: number
  group_title: string
  balance: number
  description: string
  street: number
  street_name: string
  house: string
  is_active: boolean
  gateway: number
  gateway_title: string
  auto_renewal_service: boolean
  device: number
  device_comment: string
  dev_port: number | null
  last_connected_service: number | null
  current_service: number | null
  service_title: string | null
  is_dynamic_ip: boolean
  full_name: string
  raw_password: string
}
export type ICustomerList = IDRFListResponse<ICustomer>
export type ICustomerAxoisResponsePromise = IDRFAxiosResponsePromise<ICustomer>
export type ICustomerListAxiosResponsePromise = IDRFAxiosResponsePromise<ICustomerList>

export interface IDRFRequestListParametersCustomer extends IDRFRequestListParameters {
  group: number
}

export interface ICustomerGroup extends IGroup {
  usercount: number
}
export type ICustomerGroupList = IDRFListResponse<ICustomerGroup>
export type ICustomerGroupAxoisResponsePromise = IDRFAxiosResponsePromise<ICustomerGroup>
export type ICustomerGroupListAxiosResponsePromise = IDRFAxiosResponsePromise<ICustomerGroupList>

export interface IServiceUser {
  pk: number
  group_id: number
  username: string
  fio: string
}
export type IServiceUserList = IDRFListResponse<IServiceUser>
export type IServiceUserAxoisResponsePromise = IDRFAxiosResponsePromise<IServiceUser>
export type IServiceUserListAxiosResponsePromise = IDRFAxiosResponsePromise<IServiceUserList>

// ICustomerRawPassword
export interface ICustomerRawPassword {
  pk: number
  passw_text: number
}

// IAdditionalTelephone
export interface IAdditionalTelephone {
  pk: number
  telephone: string
  owner_name: string
  customer: number
}
export type IAdditionalTelephoneList = IDRFListResponse<IAdditionalTelephone>
export type IAdditionalTelephoneAxoisResponsePromise = IDRFAxiosResponsePromise<IAdditionalTelephone>
export type IAdditionalTelephoneListAxiosResponsePromise = IDRFAxiosResponsePromise<IAdditionalTelephoneList>

// ICustomerLog
export interface ICustomerLog {
  pk: number
  customer: number
  cost: number
  author: number
  comment: string
  date: string
}

// ICustomerStreet
export interface ICustomerStreet {
  pk: number
  name: string
  group: number
}
export type ICustomerStreetList = IDRFListResponse<ICustomerStreet>
export type ICustomerStreetAxoisResponsePromise = IDRFAxiosResponsePromise<ICustomerStreet>
export type ICustomerStreetListAxiosResponsePromise = IDRFAxiosResponsePromise<ICustomerStreetList>

// ICustomerService
export interface ICustomerService {
  pk: number
  service: number
  start_time: string
  deadline: string
}
