/* eslint-disable camelcase */
import { IDRFAxiosResponsePromise, IDRFListResponse } from '@/api/types'
import { IAddressEnumTypes } from '../addresses/types'

export interface IFiasRecursiveAddress {
  id: number
  title: string
  parent_addr: number
  address_type: IAddressEnumTypes
  address_type_name: string
  fias_address_level: number
  fias_address_level_name: string
  fias_address_type: number
  fias_address_type_name: string
}
export type IFiasRecursiveAddressList = IDRFListResponse<IFiasRecursiveAddress>
export type IFiasRecursiveAddressAxoisResponsePromise = IDRFAxiosResponsePromise<IFiasRecursiveAddress>
export type IFiasRecursiveAddressListAxiosResponsePromise = IDRFAxiosResponsePromise<IFiasRecursiveAddressList>

export type IAddrLevelItem = [number, string]
export type IAddrLevelItemsIDRFAxiosResponsePromise = IDRFAxiosResponsePromise<IAddrLevelItem[]>
export type IAddrTypeItem = [number, string]
export type IAddrTypeItemsIDRFAxiosResponsePromise = IDRFAxiosResponsePromise<IAddrTypeItem[]>
