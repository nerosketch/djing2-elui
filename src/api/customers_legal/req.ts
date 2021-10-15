import request from '@/utils/request'
import {
  IChoiceItemType,
  IChoiceItemTypeListAxiosResponsePromise,
  IDRFRequestListParameters,
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
  ICustomerLegalList,
  ICustomerLegalListAxiosResponsePromise,
  ICustomerLegalPost,
  ICustomerLegalPostAxoisResponsePromise,
  ICustomerLegalPostList,
  ICustomerLegalPostListAxiosResponsePromise
} from './types'

// CustomerLegal model
export const getCustomersLegal = (params?: IDRFRequestListParameters): ICustomerLegalListAxiosResponsePromise =>
  request.get<ICustomerLegalList>('/legal/', { params })

export const getCustomerLegal = (uid: number): ICustomerLegalAxoisResponsePromise =>
  request.get<ICustomerLegal>(`/legal/${uid}/`)

export const addCustomerLegal = (info: object): ICustomerLegalAxoisResponsePromise =>
  request.post<ICustomerLegal>('/legal/', info)

export const patchCustomerLegal = (uid: number, info: object): ICustomerLegalAxoisResponsePromise =>
  request.patch<ICustomerLegal>(`/legal/${uid}/`, info)

export const delCustomerLegal = (uid: number) =>
  request.delete(`/legal/${uid}`)

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
