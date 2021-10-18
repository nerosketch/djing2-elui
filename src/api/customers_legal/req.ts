import request from '@/utils/request'
import {
  IChoiceItemType,
  IChoiceItemTypeListAxiosResponsePromise,
  IDRFAxiosResponsePromise,
  IDRFRequestListParameters,
  IObjectGroupPermsInitial,
  IObjectGroupPermsInitialAxiosResponsePromise
} from '@/api/types'
import {
  ICustomerLegal,
  ICustomerLegalAxoisResponsePromise,
  ICustomerLegalBank,
  ICustomerLegalBankAxoisResponsePromise,
} from './types'
import {
  addObjectDecorator,
  delObjectDecorator,
  getObjectDecorator,
  getObjectListDecorator,
  patchObjectDecorator
} from '@/api/baseRequests'
import {
  ICustomerList,
  ICustomerListAxiosResponsePromise
} from '../customers/types'


// CustomerLegal model
const baseCustomerLegalUrl = '/legal/'
export const getCustomersLegal = getObjectListDecorator<ICustomerLegal>(baseCustomerLegalUrl)
export const getCustomerLegal = getObjectDecorator<ICustomerLegal>(baseCustomerLegalUrl)
export const addCustomerLegal = addObjectDecorator<ICustomerLegal>(baseCustomerLegalUrl)
export const patchCustomerLegal = patchObjectDecorator<ICustomerLegal>(baseCustomerLegalUrl)
export const delCustomerLegal = delObjectDecorator<ICustomerLegal>(baseCustomerLegalUrl)

export const getCustomerLegalObjectsPerms = (customerId: number): IObjectGroupPermsInitialAxiosResponsePromise =>
  request.get<IObjectGroupPermsInitial>(`/legal/${customerId}/get_object_perms/`)

export const getLegalTypes = (): IChoiceItemTypeListAxiosResponsePromise =>
  request.get<IChoiceItemType[]>('/legal/get_legal_types/')

export const getLegalInitial = (): ICustomerLegalAxoisResponsePromise =>
  request.get<ICustomerLegal>('/legal/get_initial/')

export const getLegalBranches = (customerLegalId: number, params?: IDRFRequestListParameters) =>
  request.get(`/legal/${customerLegalId}/get_branches/`, { params })


// CustomerLegalBank
export const getLegalBanks = (legalCustomerId: number): IDRFAxiosResponsePromise<ICustomerLegalBank[]> =>
  request.get<ICustomerLegalBank[]>('/legal/bank/', {params: {legal_customer: legalCustomerId}})

export const addLegalBank = (legalCustomerId: number, info: object): ICustomerLegalBankAxoisResponsePromise =>
  request.post<ICustomerLegalBank>('/legal/bank/', Object.assign(info, {
    legal_customer: legalCustomerId
  }))

export const patchLegalBank = (bankId: number, info: object): ICustomerLegalBankAxoisResponsePromise =>
  request.patch<ICustomerLegalBank>(`/legal/bank/${bankId}/`, info)
