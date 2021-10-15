import request from '@/utils/request'
import {
  IChoiceItemType,
  IChoiceItemTypeListAxiosResponsePromise,
  IObjectGroupPermsInitial,
  IObjectGroupPermsInitialAxiosResponsePromise
} from '@/api/types'
import {
  ICustomerLegal,
  ICustomerLegalAxoisResponsePromise,
  ICustomerLegalBank,
  ICustomerLegalBankAxoisResponsePromise,
  ICustomerLegalBankList,
  ICustomerLegalBankListAxiosResponsePromise,
  ICustomerLegalPost,
  ICustomerLegalPostAxoisResponsePromise,
  ICustomerLegalPostList,
  ICustomerLegalPostListAxiosResponsePromise
} from './types'
import {
  addObjectDecorator,
  delObjectDecorator,
  getObjectDecorator,
  getObjectListDecorator,
  patchObjectDecorator
} from '@/api/baseRequests'


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


// CustomerLegalPost
export const getLegalPosts = (legalCustomerId: number): ICustomerLegalPostListAxiosResponsePromise =>
  request.get<ICustomerLegalPostList>('/legal/post/', { params: {legal_customer: legalCustomerId}})

export const addLegalCustomerPost = (legalCustomerId: number, info: object): ICustomerLegalPostAxoisResponsePromise =>
  request.post<ICustomerLegalPost>('/legal/post/', Object.assign(info, {
    legal_customer: legalCustomerId,
  }))

export const patchLegalCustomerPost = (postId: number, info: object): ICustomerLegalPostAxoisResponsePromise =>
  request.put<ICustomerLegalPost>(`/legal/post/${postId}/`, info)


// CustomerLegalBank
export const getLegalBank = (legalCustomerId: number): ICustomerLegalBankListAxiosResponsePromise =>
  request.get<ICustomerLegalBankList>('/legal/bank/', {params: {legal_custoemr: legalCustomerId}})

export const addLegalBank = (legalCustomerId: number, info: object): ICustomerLegalBankAxoisResponsePromise =>
  request.post<ICustomerLegalBank>('/legal/bank/', Object.assign(info, {
    legal_customer: legalCustomerId
  }))

export const patchLegalBank = (bankId: number, info: object): ICustomerLegalBankAxoisResponsePromise =>
  request.patch<ICustomerLegalBank>(`/legal/bank/${bankId}`, info)
