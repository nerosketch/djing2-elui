import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import {
  IDRFRequestListParameters,
  ISimpleResponseResultAxiosResponsePromise,
  ISimpleResponseResult,
  IObjectGroupPermsInitial,
  IObjectGroupPermsInitialAxiosResponsePromise,
  IObjectGroupPermsResultStruct
} from '@/api/types'
import {
  ICustomerAddressList,
  ICustomerAddressListAxiosResponsePromise,
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
  IDRFRequestListParametersInvoice,
  IInvoice4Payment,
  IInvoice4PaymentAxoisResponsePromise,
  IInvoice4PaymentList,
  IInvoice4PaymentListAxiosResponsePromise,
  ICustomerLogList,
  ICustomerLogListAxiosResponsePromise,
  ICustomerServiceAxoisResponsePromise,
  ICustomerService,
  ICustomerOnPort,
  ICustomersOnPortAxoisPromise,
  IBalanceAmountRequest,
  ICustomerAttachementAxoisResponsePromise,
  ICustomerAttachement,
  IPassportInfoAxoisResponsePromise,
  IPassportInfo,
  CustomerServiceTypeReportResult,
  CustomerServiceTypeReportResultAxoisResponsePromise,
  CustomerActivityReportResultAxoisResponsePromise,
  CustomerActivityReportResult,
  IPeriodicPayForIdRequest,
  IPeriodicPayForIdListAxiosResponsePromise,
  IPeriodicPayForIdList,
  IBuyPayloadType,
  ICustomerAfkItemListAxiosResponsePromise,
  ICustomerAfkItem,
  ICustomerAfkItemParams
} from './types'
import { IDynamicContentFieldList, IDynamicContentFieldListAxiosResponsePromise } from '../dynamic-fields/types'

// ICustomer
const custApiUrl = '/customers/'
export const getCustomers = (params?: IDRFRequestListParametersCustomer): ICustomerListAxiosResponsePromise =>
  request.get<ICustomerList>(custApiUrl, { params })

export const findCustomers = (name: string): ICustomerListAxiosResponsePromise =>
  request.get<ICustomerList>(custApiUrl, { params: { search: name } })

export const getCustomer = (id: number): ICustomerAxoisResponsePromise =>
  request.get<ICustomer>(`${custApiUrl}${id}/`)

export const getCustomerFormInitial = (): ICustomerAxoisResponsePromise =>
  request.get<ICustomer>(`${custApiUrl}get_initial/`)

export const addCustomer = (data: object): ICustomerAxoisResponsePromise =>
  request.post<ICustomer>(custApiUrl, data)

export const changeCustomer = (id: number, newData: object): ICustomerAxoisResponsePromise =>
  request.patch<ICustomer>(`${custApiUrl}${id}/`, newData)

export const delCustomer = (id: number) =>
  request.delete(`${custApiUrl}${id}/`)

export const pickService = (id: number, data: IBuyPayloadType) =>
  request.post(`${custApiUrl}${id}/pick_service/`, data)

export const makeShot = (id: number, shotId: number) =>
  request.post(`${custApiUrl}${id}/make_shot/`, { shot_id: shotId })

export const getServiceUsers = (serviceId: number): IServiceUserListAxiosResponsePromise =>
  request.get<IServiceUserList>(`${custApiUrl}service_users/`, { params: { service_id: serviceId } })

export const stopService = (id: number) =>
  request.get(`${custApiUrl}${id}/stop_service/`)

export const addBalance = (id: number, dat: IBalanceAmountRequest) =>
  request.post(`${custApiUrl}${id}/add_balance/`, dat)

export const getCurrentService = (id: number): ICustomerServiceAxoisResponsePromise =>
  request.get<ICustomerService>(`${custApiUrl}${id}/current_service/`)

export const setServiceGroupAccessory = (id: number, groupId: number, services: number[]) =>
  request.post(`${custApiUrl}${id}/set_service_group_accessory/`, {
    group_id: groupId,
    services
  })

export const filterDevicePort = (deviceId: number, portId: number): ICustomersOnPortAxoisPromise =>
  request.get<ICustomerOnPort[]>(`${custApiUrl}filter_device_port/`, {
    params: {
      device_id: deviceId,
      port_id: portId,
      fields: 'id,telephone,group,dev_port,full_name'
    }
  })

export const pingAllIps = (id: number): ISimpleResponseResultAxiosResponsePromise =>
  request.get<ISimpleResponseResult>(`${custApiUrl}${id}/ping_all_ips/`)

export const makePeriodicPay4Customer = (id: number, req: IPeriodicPayForIdRequest) =>
  request.post<string>(`${custApiUrl}${id}/make_periodic_pay/`, req)

export const generateCustomerPassword = (): AxiosPromise<string> =>
  request.get<string>(`${custApiUrl}generate_password/`)

export const setCustomerMarkers = (id: number, flags: string[]) =>
  request.post(`${custApiUrl}${id}/set_markers/`, flags)

export const getCustomersAfk = (params: ICustomerAfkItemParams): ICustomerAfkItemListAxiosResponsePromise =>
  request.get<ICustomerAfkItem[]>(`${custApiUrl}get_afk/`, { params })

// ICustomerAddress
export const getCustomerLocations = (params?: IDRFRequestListParameters): ICustomerAddressListAxiosResponsePromise =>
  request.get<ICustomerAddressList>(`${custApiUrl}addresses/`, { params })

// IAdditionalTelephone
const telBaseUrl = '/customers/additional-telephone/'
export const getTelephones = (customerId: number): IAdditionalTelephoneListAxiosResponsePromise =>
  request.get<IAdditionalTelephoneList>(telBaseUrl, { params: { customer: customerId } })

export const getTelephone = (id: number): IAdditionalTelephoneAxoisResponsePromise =>
  request.get<IAdditionalTelephone>(`${telBaseUrl}${id}/`)

export const addTelephone = (data: object): IAdditionalTelephoneAxoisResponsePromise =>
  request.post<IAdditionalTelephone>(telBaseUrl, data)

export const changeTelephone = (id: number, newData: object): IAdditionalTelephoneAxoisResponsePromise =>
  request.patch<IAdditionalTelephone>(`${telBaseUrl}${id}/`, newData)

export const delTelephone = (id: number) =>
  request.delete(`${telBaseUrl}${id}/`)

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

export const getPassportInfo = (customerId: number): IPassportInfoAxoisResponsePromise =>
  request.get<IPassportInfo>(`${custApiUrl}${customerId}/passport/`)

export const setPassportInfo = (customerId: number, info: IPassportInfo): IPassportInfoAxoisResponsePromise =>
  request.put<IPassportInfo>(`${custApiUrl}${customerId}/passport/`, info)

// CustomerAttachement
const CustomerAttachmUrl = '/customers/attachments/'
export const getAttachments = (customer: number): AxiosPromise<ICustomerAttachement[]> =>
  request.get<ICustomerAttachement[]>(CustomerAttachmUrl, { params: { customer } })

export const getAttachment = (id: number): ICustomerAttachementAxoisResponsePromise =>
  request.get<ICustomerAttachement>(`${CustomerAttachmUrl}${id}/`)

export const addAttachment = (newAtt: any): ICustomerAttachementAxoisResponsePromise => {
  const formData = new FormData()
  formData.append('doc_file', newAtt.doc_file)
  formData.append('title', newAtt.title)
  formData.append('customer', newAtt.customer)
  return request.post<ICustomerAttachement>(CustomerAttachmUrl, formData)
}

export const delAttachment = (id: number) =>
  request.delete(`${CustomerAttachmUrl}${id}/`)

export const getCustomerObjectsPerms = (customerId: number): IObjectGroupPermsInitialAxiosResponsePromise =>
  request.get<IObjectGroupPermsInitial>(`/customers/${customerId}/get_object_perms/`)

export const setCustomerObjectsPerms = (customerId: number, dat: IObjectGroupPermsResultStruct) =>
  request.put(`/customers/${customerId}/set_object_perms/`, dat)

export const getCustomerSelectedObjectPerms = (customerId: number, profileGroupId: number): AxiosPromise<number[]> =>
  request.get(`/customers/${customerId}/get_selected_object_perms/${profileGroupId}/`)
export const customerServiceTypeReportRequest = (): CustomerServiceTypeReportResultAxoisResponsePromise =>
  request.get<CustomerServiceTypeReportResult>('/customers/service_type_report/')

export const customersActivityReportRequest = (): CustomerActivityReportResultAxoisResponsePromise =>
  request.get<CustomerActivityReportResult>('/customers/activity_report/')

// PeriodicPayForId
const CustomerPPayUrl = '/customers/periodic-pay/'

export const getAssignedPeriodicPays = (account: number): IPeriodicPayForIdListAxiosResponsePromise =>
  request.get<IPeriodicPayForIdList>(CustomerPPayUrl, { params: { account } })

export const delAssignedPeriodicPay = (pid: number) =>
  request.delete(`${CustomerPPayUrl}${pid}/`)

// IDynamicContentField
export const getCombinedContentFields = (customerId: number): IDynamicContentFieldListAxiosResponsePromise =>
  request.get<IDynamicContentFieldList>('/customers/dynamic-fields/combine/', {
    params: {
      customer: customerId
    }
  })

export const changeContentFields = (info: IDynamicContentFieldList): IDynamicContentFieldListAxiosResponsePromise =>
  request.put<IDynamicContentFieldList>('/customers/dynamic-fields/update_all/', info)
