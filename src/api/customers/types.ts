import { IDRFAxiosResponsePromise, IDRFListResponse, IDRFRequestListParameters } from '@/api/types'
import { IGroup } from '@/api/groups/types'
import { IService } from '@/api/services/types'
import { AxiosPromise } from 'axios'

// ICustomer
export interface ICustomer {
  pk: number
  username: string
  telephone: string
  fio: string
  birth_day: string
  create_date: string
  group: number
  group_title?: string
  balance: number
  description: string
  street: number
  street_name?: string
  house: string
  is_active: boolean
  gateway: number
  gateway_title?: string
  auto_renewal_service: boolean
  device: number
  device_comment?: string
  dev_port: number
  last_connected_service: number | null
  last_connected_service_title: string
  current_service: number | null
  service_title?: string | null
  service_id: number | null
  is_dynamic_ip: boolean
  full_name?: string
  raw_password?: string
  lease_count: number
  sites: number[]
}
export type ICustomerList = IDRFListResponse<ICustomer>
export type ICustomerAxoisResponsePromise = IDRFAxiosResponsePromise<ICustomer>
export type ICustomerListAxiosResponsePromise = IDRFAxiosResponsePromise<ICustomerList>

export interface ICustomerOnPort {
  pk: number
  telephone: string
  group: number
  dev_port: number
  full_name: string
}
export type ICustomerOnPortAxoisPromise = AxiosPromise<ICustomerOnPort>
export type ICustomersOnPortAxoisPromise = AxiosPromise<ICustomerOnPort[]>

export interface IDRFRequestListParametersCustomer extends IDRFRequestListParameters {
  group: number
  street?: number
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

export interface ICustomerFrm {
  username: string
  telephone: string
  fio: string
  birth_day: string | null
  group: number
  street: number | null
  house: string
  is_active: boolean
  is_dynamic_ip: boolean
  gateway: number
  description: string
}

// ICustomerRawPassword
export interface ICustomerRawPassword {
  pk: number
  passw_text: number
}

// IAdditionalTelephone
export interface IAdditionalTelephone {
  id: number
  telephone: string
  owner_name: string
  customer: number
}
export type IAdditionalTelephoneList = IDRFListResponse<IAdditionalTelephone>
export type IAdditionalTelephoneAxoisResponsePromise = IDRFAxiosResponsePromise<IAdditionalTelephone>
export type IAdditionalTelephoneListAxiosResponsePromise = IDRFAxiosResponsePromise<IAdditionalTelephoneList>

// ICustomerLog
export interface ICustomerLog {
  customer: number
  cost: number
  author: number | null
  author_name?: string
  comment: string
  date: string
}
export type ICustomerLogList = IDRFListResponse<ICustomerLog>
export type ICustomerLogListAxiosResponsePromise = IDRFAxiosResponsePromise<ICustomerLogList>

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
  service: IService
  start_time: string
  deadline: string
  last_connected_service_title?: string
}
export type ICustomerServiceAxoisResponsePromise = IDRFAxiosResponsePromise<ICustomerService>

// IInvoice4Payment
export interface IInvoice4Payment {
  id: number
  author_name: string
  author_uname: string
  status: boolean
  cost: number
  comment: string
  date_create: string
  date_pay: string | null
  customer: number
  author: number
}
export type IInvoice4PaymentList = IDRFListResponse<IInvoice4Payment>
export type IInvoice4PaymentAxoisResponsePromise = IDRFAxiosResponsePromise<IInvoice4Payment>
export type IInvoice4PaymentListAxiosResponsePromise = IDRFAxiosResponsePromise<IInvoice4PaymentList>
export interface IDRFRequestListParametersInvoice extends IDRFRequestListParameters {
  customer: number
}

// IPassportInfo
export interface IPassportInfo {
  id: number
  series: string
  number: string
  distributor: string
  date_of_acceptance: string
}
export type IPassportInfoList = IDRFListResponse<IPassportInfo>
export type IPassportInfoAxoisResponsePromise = IDRFAxiosResponsePromise<IPassportInfo>

// IBalanceAmountRequest
export interface IBalanceAmountRequest {
  cost: number
  comment: string
}

// CustomerAttachement
export interface ICustomerAttachement {
  id: number
  title: string
  doc_file: string
  customer: number
  customer_name: string
  create_time?: string
  author?: number
  author_name?: string
}
export type ICustomerAttachementAxoisResponsePromise = IDRFAxiosResponsePromise<ICustomerAttachement>

interface CustomerServiceTypeReportCalcType {
  calc_type_count: number
  service_descr: string
}
export interface CustomerServiceTypeReportResult {
  all_count: number
  admin_count: number
  zero_cost_count: number
  calc_type_counts: CustomerServiceTypeReportCalcType[]
}
export type CustomerServiceTypeReportResultAxoisResponsePromise = IDRFAxiosResponsePromise<CustomerServiceTypeReportResult>

export interface CustomerActivityReportResult {
  all_count: number
  enabled_count: number
  with_services_count: number
  active_count: number
  commercial_customers: number
}
export type CustomerActivityReportResultAxoisResponsePromise = IDRFAxiosResponsePromise<CustomerActivityReportResult>

export interface IPeriodicPayForIdRequest {
  periodic_pay_id: number
  next_pay: string
}

export interface IPeriodicPayForId {
  id: number
  periodic_pay: number
  last_pay: string
  next_pay: string
  service_name: string
  service_calc_type: string
  service_amount: number
}
export type IPeriodicPayForIdList = IDRFListResponse<IPeriodicPayForId>
// export type IPeriodicPayForIdAxoisResponsePromise = IDRFAxiosResponsePromise<IPeriodicPayForId>
export type IPeriodicPayForIdListAxiosResponsePromise = IDRFAxiosResponsePromise<IPeriodicPayForIdList> | IDRFAxiosResponsePromise<IPeriodicPayForId[]>
