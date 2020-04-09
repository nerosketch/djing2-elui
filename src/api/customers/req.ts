import request from '@/utils/request'
import { IDRFRequestListParameters } from '@/api/types'
import {
  ICustomerGroupList,
  ICustomerGroupListAxiosResponsePromise,
  ICustomer, ICustomerList,
  ICustomerAxoisResponsePromise,
  ICustomerListAxiosResponsePromise,
  IDRFRequestListParametersCustomer,
  IServiceUserList,
  IServiceUserListAxiosResponsePromise,
  IAdditionalTelephone,
  IAdditionalTelephoneList,
  IAdditionalTelephoneAxoisResponsePromise,
  IAdditionalTelephoneListAxiosResponsePromise,
  ICustomerStreet,
  ICustomerStreetList,
  ICustomerStreetAxoisResponsePromise,
  ICustomerStreetListAxiosResponsePromise,
  IDRFRequestListParametersInvoice,
  IInvoice4Payment,
  IInvoice4PaymentAxoisResponsePromise,
  IInvoice4PaymentList,
  IInvoice4PaymentListAxiosResponsePromise,
  ICustomerLogList,
  ICustomerLogListAxiosResponsePromise,
  IPassportInfoListAxiosResponsePromise,
  IPassportInfoList,
  ICustomerServiceAxoisResponsePromise,
  ICustomerService
} from './types'

// ICustomer
const custApiUrl = '/customers/'
export const getCustomers = (params?: IDRFRequestListParametersCustomer): ICustomerListAxiosResponsePromise =>
  request.get<ICustomerList>(custApiUrl, { params })

export const getCustomer = (id: number): ICustomerAxoisResponsePromise =>
  request.get<ICustomer>(`${custApiUrl}${id}/`)

export const getCustomerFormInitial = (): ICustomerAxoisResponsePromise =>
  request.get<ICustomer>(`${custApiUrl}get_initial/`)

export const addCustomer = (data: ICustomer): ICustomerAxoisResponsePromise =>
  request.post<ICustomer>(custApiUrl, data)

export const changeCustomer = (id: number, newData: ICustomer): ICustomerAxoisResponsePromise =>
  request.patch<ICustomer>(`${custApiUrl}${id}/`, newData)

export const delCustomer = (id: number) =>
  request.delete(`${custApiUrl}${id}/`)

export const pickService = (id: number, serviceId: number, deadline?: string) =>
  request.post(`${custApiUrl}${id}/pick_service/`, { service_id: serviceId, deadline })

export const makeShot = (id: number, shotId: number) =>
  request.post(`${custApiUrl}${id}/make_shot/`, { shot_id: shotId })

export const getServiceUsers = (serviceId: number): IServiceUserListAxiosResponsePromise =>
  request.get<IServiceUserList>(`${custApiUrl}service_users/`, { params: { service_id: serviceId } })

export const stopService = (id: number) =>
  request.get(`${custApiUrl}${id}/stop_service/`)

export const addBalance = (id: number, cost: number, comment?: string) =>
  request.post(`${custApiUrl}${id}/add_balance/`, { cost, comment })

export const getCurrentService = (id: number): ICustomerServiceAxoisResponsePromise =>
  request.get<ICustomerService>(`${custApiUrl}${id}/current_service/`)

// ICustomerGroup
export const getCustomerGroups = (params?: IDRFRequestListParameters): ICustomerGroupListAxiosResponsePromise =>
  request.get<ICustomerGroupList>(`${custApiUrl}groups/`, { params })

// IAdditionalTelephone
const telBaseUrl = '/customers/additional-telephone/'
export const getTelephones = (customerId: number): IAdditionalTelephoneListAxiosResponsePromise =>
  request.get<IAdditionalTelephoneList>(telBaseUrl, { params: { customer: customerId } })

export const getTelephone = (id: number): IAdditionalTelephoneAxoisResponsePromise =>
  request.get<IAdditionalTelephone>(`${telBaseUrl}${id}/`)

export const addTelephone = (data: IAdditionalTelephone): IAdditionalTelephoneAxoisResponsePromise =>
  request.post<IAdditionalTelephone>(telBaseUrl, data)

export const changeTelephone = (id: number, newData: IAdditionalTelephone): IAdditionalTelephoneAxoisResponsePromise =>
  request.patch<IAdditionalTelephone>(`${telBaseUrl}${id}/`, newData)

export const delTelephone = (id: number) =>
  request.delete(`${telBaseUrl}${id}/`)

// ICustomerStreet
const streetBaseUrl = '/customers/streets/'

export const getStreets = (params?: IDRFRequestListParametersCustomer): ICustomerStreetListAxiosResponsePromise =>
  request.get<ICustomerStreetList>(streetBaseUrl, { params })

export const getStreet = (id: number): ICustomerStreetAxoisResponsePromise =>
  request.get<ICustomerStreet>(`${streetBaseUrl}${id}/`)

export const addStreet = (street: ICustomerStreet): ICustomerStreetAxoisResponsePromise =>
  request.post<ICustomerStreet>(streetBaseUrl, street)

export const changeStreet = (id: number, newData: ICustomerStreet): ICustomerStreetAxoisResponsePromise =>
  request.patch<ICustomerStreet>(`${streetBaseUrl}${id}/`, newData)

export const delStreet = (id: number) =>
  request.delete(`${streetBaseUrl}${id}/`)

// IInvoice4Payment
const invBaseUrl = '/customers/invoices/'

export const getInvoices = (params?: IDRFRequestListParametersInvoice): IInvoice4PaymentListAxiosResponsePromise =>
  request.get<IInvoice4PaymentList>(invBaseUrl, { params })

export const getInvoice = (id: number): IInvoice4PaymentAxoisResponsePromise =>
  request.get<IInvoice4Payment>(`${invBaseUrl}${id}/`)

export const addInvoice = (inv: IInvoice4Payment): IInvoice4PaymentAxoisResponsePromise =>
  request.post<IInvoice4Payment>(invBaseUrl, inv)

export const changeInvoice = (id: number, newData: IInvoice4Payment): IInvoice4PaymentAxoisResponsePromise =>
  request.patch<IInvoice4Payment>(`${invBaseUrl}${id}/`, newData)

export const delInvoice = (id: number) =>
  request.delete(`${invBaseUrl}${id}/`)

// CustomerLog
export const getCustomerPayLog = (params?: IDRFRequestListParametersInvoice): ICustomerLogListAxiosResponsePromise =>
  request.get<ICustomerLogList>('/customers/customer-log/', { params })

// IPassportInfo
const pspBaseUrl = '/customers/passport/'

export const findPassportInfo = (customerId: number): IPassportInfoListAxiosResponsePromise =>
  request.get<IPassportInfoList>(pspBaseUrl, { params: {customer: customerId} })
