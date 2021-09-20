/* eslint-disable camelcase */
import { IDRFAxiosResponsePromise, IDRFListResponse } from '@/api/types'

export interface IFiasRecursiveAddress {
  id: number
  parent_ao: number
  title: string
  ao_level: number
  ao_level_name: string
  ao_type: number
  ao_type_name: string
  locality: number
}
export type IFiasRecursiveAddressList = IDRFListResponse<IFiasRecursiveAddress>
export type IFiasRecursiveAddressAxoisResponsePromise = IDRFAxiosResponsePromise<IFiasRecursiveAddress>
export type IFiasRecursiveAddressListAxiosResponsePromise = IDRFAxiosResponsePromise<IFiasRecursiveAddressList>

export type IAddrLevelItem = [number, string]
export type IAddrLevelItemsIDRFAxiosResponsePromise = IDRFAxiosResponsePromise<IAddrLevelItem[]>
export type IAddrTypeItem = [number, string]
export type IAddrTypeItemsIDRFAxiosResponsePromise = IDRFAxiosResponsePromise<IAddrTypeItem[]>
