/* eslint-disable camelcase */
import { AxiosPromise } from 'axios'
import {
  IDRFAxiosResponsePromise,
  IDRFListResponse,
  IDRFRequestListParameters
} from '@/api/types'
import { IBaseAccount } from '@/api/base_account'
import { IService } from '@/api/services/types'
import { IDRFRequestListFilterParameters } from '@/api/addresses/types'

// ICustomer
export interface ICustomer extends IBaseAccount{
  group: number
  group_title?: string
  address: number
  address_title: string
  balance: number
  description: string
  gateway: number
  gateway_title?: string
  auto_renewal_service: boolean
  device: number
  device_comment?: string
  dev_port: number
  last_connected_service: number | null
  last_connected_service_title: string
  current_service: number | null
  current_service_title?: string | null
  service_id: number | null
  is_dynamic_ip: boolean
  full_name?: string
  raw_password?: string
  lease_count: number
  traf_octs: number | null
  marker_icons: string[]
}
export type ICustomerList = IDRFListResponse<ICustomer>
export type ICustomerAxoisResponsePromise = IDRFAxiosResponsePromise<ICustomer>
export type ICustomerListAxiosResponsePromise = IDRFAxiosResponsePromise<ICustomerList>

export interface ICustomerOnPort {
  id: number
  telephone: string
  group: number
  dev_port: number
  full_name: string
}
export type ICustomersOnPortAxoisPromise = AxiosPromise<ICustomerOnPort[]>

export interface IServiceUser {
  id: number
  group_id: number
  username: string
  fio: string
}
export type IServiceUserList = IServiceUser[]
export type IServiceUserListAxiosResponsePromise = IDRFAxiosResponsePromise<IServiceUserList>

export interface ICustomerFrm {
  username: string
  telephone: string
  fio: string
  birth_day: string | null
  group: number
  address: number
  is_active: boolean
  is_dynamic_ip: boolean
  gateway: number
  description: string
}

// ICustomerRawPassword
export interface ICustomerRawPassword {
  id: number
  passw_text: number
}

// IAdditionalTelephone
export interface IAdditionalTelephone {
  id: number
  telephone: string
  owner_name: string
  customer: number
  create_time: string
}
export type IAdditionalTelephoneList = IDRFListResponse<IAdditionalTelephone>
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

// ICustomerService
export interface ICustomerService {
  id: number
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
  division_code: string
  registration_address: number
  registration_address_title: string
}
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
export type IPeriodicPayForIdListAxiosResponsePromise = IDRFAxiosResponsePromise<IPeriodicPayForIdList>

export interface IBuyPayloadType {
  service_id: number,
  deadline?: string
}

export interface ICustomerAfkItem {
  timediff: string
  customer_id: number
  last_date: string
  customer_uname: string
  customer_fio: string
}
export type ICustomerAfkItemListAxiosResponsePromise = IDRFAxiosResponsePromise<ICustomerAfkItem[]>

export interface ICustomerAfkItemParams {
  date_limit: string | null
  out_limit: number
  locality: number
}

export interface IDRFRequestListIsActiveFilterParameters extends IDRFRequestListFilterParameters {
  is_active: boolean | null
}

// -----------------------------------------------------
// Customer Filters
// -----------------------------------------------------

export interface IItemType {
  v: number
  l: string
}


export interface ICompareItem extends IItemType {
}


export interface CustomerFieldMeta {
  fieldType: string
}

export interface CustomerField extends IItemType {
  m: CustomerFieldMeta
}

export interface IAllCompares {
  [fieldType: string]: ICompareItem[]
}

export interface IConditionComponents {
  [fieldType: string]: any
}

export interface IFilterData {
  field: number
  compareOperator: number
  conditionValue: any
}

export interface ICustomerFiltersStore {
  customerFields: CustomerField[]
  customerFkFields: CustomerField[]
}

export interface IAggregateFilter {
  aggr: number
  filter: IFilterData
}
