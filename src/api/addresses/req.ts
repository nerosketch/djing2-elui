import request from '@/utils/request'
import { IDRFAxiosResponsePromise, IDRFRequestListParameters } from '@/api/types'
import {
  IAddressModel,
  IAddressModelAxoisResponsePromise,
  IAddressModelList,
  IAddressModelListAxiosResponsePromise,
  IAddressModelPlainListAxiosResponsePromise,
  IAddressType,
  IAddressTypeListAxiosResponsePromise,
  IAddrLevelItem,
  IAddrLevelItemsIDRFAxiosResponsePromise,
  IAddrTypeItem,
  IAddrTypeItemsIDRFAxiosResponsePromise,
} from './types'


export interface IDRFRequestListAddrsParameters extends IDRFRequestListParameters {
  address_type?: number
  parent_addr?: number
}

// IAddressModel
export const getAddresses = (params?: IDRFRequestListAddrsParameters): IAddressModelListAxiosResponsePromise =>
  request.get<IAddressModelList>('/addrs/', { params })

export const getAddress = (id: number): IAddressModelAxoisResponsePromise =>
  request.get<IAddressModel>(`/addrs/${id}/`)

export const addAddress = (info: object): IAddressModelAxoisResponsePromise =>
  request.post<IAddressModel>('/addrs/', info)

export const delAddress = (id: number) =>
  request.delete(`/addrs/${id}/`)

export const changeAddress = (id: number, info: object): IAddressModelAxoisResponsePromise =>
  request.patch<IAddressModel>(`/addrs/${id}/`, info)

export const getAddrTypes = (): IAddressTypeListAxiosResponsePromise =>
  request.get<IAddressType[]>('/addrs/get_addr_types/')

export const getStreets = (parent_addr?: number): IAddressModelListAxiosResponsePromise =>
  request.get<IAddressModelList>('/addrs/get_streets/', { params: { parent_addr }})

export const getAddrParent = (id: number): IDRFAxiosResponsePromise<IAddressModel | null> =>
  request.get<IAddressModel | null>(`/addrs/${id}/get_parent/`)

export const getAddrLevels = (): IAddrLevelItemsIDRFAxiosResponsePromise =>
  request.get<IAddrLevelItem[]>('/addrs/get_ao_levels/')

export const getFiasAddrTypes = (level: number): IAddrTypeItemsIDRFAxiosResponsePromise =>
  request.get<IAddrTypeItem[]>('/addrs/get_ao_types/', { params: { level } })

export const filterByFiasLevel = (level: number, fields?: string): IAddressModelPlainListAxiosResponsePromise =>
  request.get<IAddressModel[]>('/addrs/filter_by_fias_level/', { params: { level, fields } })

// export const fetchAddrAutocomplete = (findStr: string): IAddressModelPlainListAxiosResponsePromise =>
  // request.get<IAddressModel[]>('/addrs/autocomplete/', {params: { search: findStr }})
