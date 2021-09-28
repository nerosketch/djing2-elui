/* eslint-disable camelcase */
import {
  IDRFAxiosResponsePromise,
  IDRFListResponse
} from '@/api/types'

export enum IAddressEnumTypes {
  UNKNOWN = 0,
  LOCALITY = 4,
  STREET = 8
}

export interface IAddressModel {
  id: number
  title: string
  address_type: IAddressEnumTypes
  address_type_name: string
  parent_addr?: number
  parent_addr_title?: string
  fias_address_level: number
  fias_address_level_name: string
  fias_address_type: number
  fias_address_type_name: string
}
export type IAddressModelList = IDRFListResponse<IAddressModel>
export type IAddressModelAxoisResponsePromise = IDRFAxiosResponsePromise<IAddressModel>
export type IAddressModelListAxiosResponsePromise = IDRFAxiosResponsePromise<IAddressModelList>

export interface IAddressType {
  value: number
  label: string
}
export type IAddressTypeListAxiosResponsePromise = IDRFAxiosResponsePromise<IAddressType[]>

export type IAddrLevelItem = [number, string]
export type IAddrLevelItemsIDRFAxiosResponsePromise = IDRFAxiosResponsePromise<IAddrLevelItem[]>
export type IAddrTypeItem = [number, string]
export type IAddrTypeItemsIDRFAxiosResponsePromise = IDRFAxiosResponsePromise<IAddrTypeItem[]>
