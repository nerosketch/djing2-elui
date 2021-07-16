import request from '@/utils/request'
import { IDRFAxiosResponsePromise, IDRFRequestListParameters } from '@/api/types'
import {
  IFiasRecursiveAddress,
  IFiasRecursiveAddressList,
  IFiasRecursiveAddressAxoisResponsePromise,
  IFiasRecursiveAddressListAxiosResponsePromise,
  IAddrLevelItemsIDRFAxiosResponsePromise,
  IAddrLevelItem,
  IAddrTypeItemsIDRFAxiosResponsePromise,
  IAddrTypeItem
} from './types'

export const getAddrs = (params?: IDRFRequestListParameters): IFiasRecursiveAddressListAxiosResponsePromise =>
  request.get<IFiasRecursiveAddressList>('/sorm/addr/', { params })

export const getAddr = (id: number): IFiasRecursiveAddressAxoisResponsePromise =>
  request.get<IFiasRecursiveAddress>(`/sorm/addr/${id}/`)

export const getAddrParent = (id: number): IDRFAxiosResponsePromise<IFiasRecursiveAddress | null> =>
  request.get<IFiasRecursiveAddress>(`/sorm/addr/${id}/get_parent/`)

export const addAddr = (info: object): IFiasRecursiveAddressAxoisResponsePromise =>
  request.post<IFiasRecursiveAddress>('/sorm/addr/', info)

export const delAddr = (id: number) =>
  request.delete(`/sorm/addr/${id}/`)

export const changeAddr = (id: number, info: object): IFiasRecursiveAddressAxoisResponsePromise =>
  request.patch<IFiasRecursiveAddress>(`/sorm/addr/${id}/`, info)

export const getAddrLevels = (): IAddrLevelItemsIDRFAxiosResponsePromise =>
  request.get<IAddrLevelItem[]>('/sorm/addr/get_ao_levels/')

export const getAddrTypes = (level?: number): IAddrTypeItemsIDRFAxiosResponsePromise =>
  request.get<IAddrTypeItem[]>('/sorm/addr/get_ao_types/', { params: { level } })
