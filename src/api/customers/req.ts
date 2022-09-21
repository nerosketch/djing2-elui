import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import {
  ISimpleResponseResultAxiosResponsePromise,
  ISimpleResponseResult,
  IObjectGroupPermsInitial,
  IObjectGroupPermsInitialAxiosResponsePromise,
  IObjectGroupPermsResultStruct,
  IDRFAxiosResponsePromise,
  IDRFRequestListParameters,
} from '@/api/types'
import {
  ICustomer, ICustomerList,
  ICustomerAxoisResponsePromise,
  ICustomerListAxiosResponsePromise,
  IServiceUserList,
  IServiceUserListAxiosResponsePromise,
  IAdditionalTelephone,
  IAdditionalTelephoneList,
  IAdditionalTelephoneListAxiosResponsePromise,
  IInvoice4Payment,
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
  ICustomerAfkItemParams,
  ICustomerLog,
  CustomerField,
  IAllFilterData
} from './types'
import {
  IDynamicContentFieldList,
  IDynamicContentFieldListAxiosResponsePromise
} from '@/api/dynamic-fields/types'
import {
  addObjectDecorator,
  delObjectDecorator,
  getObjectDecorator,
  getObjectListDecorator,
  patchObjectDecorator
} from '@/api/baseRequests'
import { IGroup } from '@/api/groups/types'
import { IDRFRequestListAddrsParameters } from '../addresses/req'


// ICustomer
const custApiUrl = '/customers/'
export const getCustomers = getObjectListDecorator<ICustomer>(custApiUrl)
export const getCustomer = getObjectDecorator<ICustomer>(custApiUrl)
export const addCustomer = addObjectDecorator<ICustomer>(custApiUrl)
export const changeCustomer = patchObjectDecorator<ICustomer>(custApiUrl)
export const delCustomer = delObjectDecorator<ICustomer>(custApiUrl)

export const findCustomers = (name: string): ICustomerListAxiosResponsePromise =>
  request.get<ICustomerList>(custApiUrl, { params: {
    search: name,
    fields: 'id,full_name'
  } })

export const getCustomerFormInitial = (): ICustomerAxoisResponsePromise =>
  request.get<ICustomer>(`${custApiUrl}get_initial/`)

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

export const getCustomersBums = getObjectListDecorator<ICustomer>('/customers/bums/')

// IAdditionalTelephone
const telBaseUrl = '/customers/additional-telephone/'
export const getTelephones = (customerId: number): IAdditionalTelephoneListAxiosResponsePromise =>
  request.get<IAdditionalTelephoneList>(telBaseUrl, { params: { customer: customerId } })

export const getTelephone = getObjectDecorator<IAdditionalTelephone>(telBaseUrl)
export const addTelephone = addObjectDecorator<IAdditionalTelephone>(telBaseUrl)
export const changeTelephone = patchObjectDecorator<IAdditionalTelephone>(telBaseUrl)
export const delTelephone = delObjectDecorator<IAdditionalTelephone>(telBaseUrl)

// IInvoice4Payment CRUD
const invBaseUrl = '/customers/invoices/'
export const getInvoices = getObjectListDecorator<IInvoice4Payment>(invBaseUrl)
export const getInvoice = getObjectDecorator<IInvoice4Payment>(invBaseUrl)
export const addInvoice = addObjectDecorator<IInvoice4Payment>(invBaseUrl)
export const changeInvoice = patchObjectDecorator<IInvoice4Payment>(invBaseUrl)
export const delInvoice = delObjectDecorator<IInvoice4Payment>(invBaseUrl)

// CustomerLog
export const getCustomerPayLog = getObjectListDecorator<ICustomerLog>('/customers/customer-log/')

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

export const delAttachment = delObjectDecorator<any>(CustomerAttachmUrl)

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

export const delAssignedPeriodicPay = delObjectDecorator<any>(CustomerPPayUrl)

// IDynamicContentField
export const getCombinedContentFields = (customerId: number): IDynamicContentFieldListAxiosResponsePromise =>
  request.get<IDynamicContentFieldList>('/customers/dynamic-fields/combine/', {
    params: {
      customer: customerId
    }
  })

export const changeContentFields = (info: IDynamicContentFieldList): IDynamicContentFieldListAxiosResponsePromise =>
  request.put<IDynamicContentFieldList>('/customers/dynamic-fields/update_all/', info)

export const getGroupsWithCustomers = (params?: IDRFRequestListAddrsParameters): IDRFAxiosResponsePromise<IGroup[]> =>
  request.get<IGroup[]>('/customers/groups_with_customers/', { params })


// -----------------------------------------------------
// Customer Filters
// -----------------------------------------------------

export const getCustomerFields = (): AxiosPromise<CustomerField[]> =>
  request.get<CustomerField[]>('/customers/filters/fields/')

export const getFilteredCustomers = (filters: IAllFilterData, params?: IDRFRequestListParameters): ICustomerListAxiosResponsePromise =>
  request.post<ICustomerList>('/customers/filters/filter/', filters, {params})
