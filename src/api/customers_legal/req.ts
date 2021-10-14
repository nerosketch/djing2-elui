import request from '@/utils/request'
import {
  IDRFRequestListParameters,
  IObjectGroupPermsInitial,
  IObjectGroupPermsInitialAxiosResponsePromise
} from '@/api/types'
import {
  ICustomerLegal,
  ICustomerLegalAxoisResponsePromise,
  ICustomerLegalList,
  ICustomerLegalListAxiosResponsePromise
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
