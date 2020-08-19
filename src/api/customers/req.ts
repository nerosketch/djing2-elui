import request from '@/utils/request'
import {
  IDRFRequestListParameters,
  ISimpleResponseResultAxiosResponsePromise,
  ISimpleResponseResult
} from '@/api/types'
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
  ICustomerService,
  ICustomerOnPort,
  ICustomersOnPortAxoisPromise,
  IBalanceAmountRequest,
  ICustomerAttachementListAxiosResponsePromise,
  ICustomerAttachementList,
  ICustomerAttachementAxoisResponsePromise,
  ICustomerAttachement
} from './types'

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

export const pickService = (id: number, serviceId: number, deadline?: string) =>
  request.post(`${custApiUrl}${id}/pick_service/`, { service_id: serviceId, deadline })

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

export const setGroupAccessory = (id: number, groupId: number, services: number[]) =>
  request.post(`${custApiUrl}${id}/set_group_accessory/`, {
    group_id: groupId,
    services
  })

export const filterDevicePort = (deviceId: number, portId: number): ICustomersOnPortAxoisPromise =>
  request.get<ICustomerOnPort[]>(`${custApiUrl}filter_device_port/`, {
    params: {
      device_id: deviceId,
      port_id: portId,
      fields: 'pk,telephone,group,dev_port,full_name'
    }
  })

export const pingAllIps = (id: number): ISimpleResponseResultAxiosResponsePromise =>
  request.get<ISimpleResponseResult>(`${custApiUrl}${id}/ping_all_ips/`)

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

export const addStreet = (street: object): ICustomerStreetAxoisResponsePromise =>
  request.post<ICustomerStreet>(streetBaseUrl, street)

export const changeStreet = (id: number, newData: object): ICustomerStreetAxoisResponsePromise =>
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
  request.get<IPassportInfoList>(pspBaseUrl, { params: { customer: customerId } })

// CustomerAttachement
const CustomerAttachmUrl = '/customers/attachments/'
export const getAttachments = (customer: number): ICustomerAttachementListAxiosResponsePromise =>
  request.get<ICustomerAttachementList>(CustomerAttachmUrl, { params: { customer } })

export const getAttachment = (id: number): ICustomerAttachementAxoisResponsePromise =>
  request.get<ICustomerAttachement>(`${CustomerAttachmUrl}${id}/`)

export const addAttachment = (newAtt: any): ICustomerAttachementAxoisResponsePromise => {
  let formData = new FormData()
  formData.append('doc_file', newAtt.doc_file)
  formData.append('title', newAtt.title)
  formData.append('customer', newAtt.customer)
  return request.post<ICustomerAttachement>(CustomerAttachmUrl, formData)
}

export const delAttachment = (id: number) =>
  request.delete(`${CustomerAttachmUrl}${id}/`)
