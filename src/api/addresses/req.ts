import request from '@/utils/request'
import {
  IDRFAxiosResponsePromise,
  IDRFRequestListParameters,
  StringAxiosResponsePromise
} from '@/api/types'
import {
  IAddressModel,
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
import {
  addObjectDecorator,
  delObjectDecorator,
  getObjectDecorator,
  patchObjectDecorator
} from '@/api/baseRequests'


export interface IDRFRequestListAddrsParameters extends IDRFRequestListParameters {
  address_type?: number
  parent_addr_id?: number
}

const addrsUrl = '/addrs/'
// IAddressModel
export const getAddresses = (params?: IDRFRequestListAddrsParameters): IAddressModelListAxiosResponsePromise =>
  request.get<IAddressModelList>(addrsUrl, { params })

export const getAddress = getObjectDecorator<IAddressModel>(addrsUrl)
export const addAddress = addObjectDecorator<IAddressModel>(addrsUrl)
export const delAddress = delObjectDecorator<IAddressModel>(addrsUrl)
export const changeAddress = patchObjectDecorator<IAddressModel>(addrsUrl)

export const getAddrTypes = (): IAddressTypeListAxiosResponsePromise =>
  request.get<IAddressType[]>('/addrs/get_addr_types/')

export const getAllChildren = (addr_type: number, parent_addr_id?: number, parent_type?: number): IAddressModelPlainListAxiosResponsePromise =>
  request.get<IAddressModel[]>('/addrs/get_all_children/', { params: {
    addr_type,
    parent_addr_id: parent_addr_id || undefined,
    parent_type
  }})

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

export const getAddrFullTitle = (addrId: number): StringAxiosResponsePromise =>
  request.get<string>(`/addrs/${addrId}/get_full_title/`)

export const getAddrIdHierarchy = (addrId: number): IDRFAxiosResponsePromise<number[]> =>
  request.get<number[]>(`/addrs/${addrId}/get_id_hierarchy/`)

export const getAddressByType = (addrId: number, addrType: number): IDRFAxiosResponsePromise<IAddressModel | null> =>
  request.get<IAddressModel | null>(`/addrs/${addrId}/get_address_by_type/?addr_type=${addrType}`)
