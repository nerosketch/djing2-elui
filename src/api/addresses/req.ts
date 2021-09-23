import request from '@/utils/request'
import { IDRFRequestListParameters } from '@/api/types'
import {
  IAddressModel,
  IAddressModelAxoisResponsePromise,
  IAddressModelList,
  IAddressModelListAxiosResponsePromise,
} from './types'

// IAddressModel
export const getAddresses = (params?: IDRFRequestListParameters): IAddressModelListAxiosResponsePromise =>
  request.get<IAddressModelList>('/addrs/', { params })

export const getAddress = (id: number): IAddressModelAxoisResponsePromise =>
  request.get<IAddressModel>(`/addrs/${id}/`)

export const addAddress = (info: object): IAddressModelAxoisResponsePromise =>
  request.post<IAddressModel>('/addrs/', info)

export const delAddress = (id: number) =>
  request.delete(`/addrs/${id}/`)

export const changeAddress = (id: number, info: object): IAddressModelAxoisResponsePromise =>
  request.patch<IAddressModel>(`/addrs/${id}/`, info)
