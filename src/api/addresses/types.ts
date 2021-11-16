/* eslint-disable camelcase */
import {
  IDRFAxiosResponsePromise,
  IDRFListResponse
} from '@/api/types'
import { TreeNode } from 'element-ui/types/tree'

export enum IAddressEnumTypes {
  UNKNOWN = 0,
  LOCALITY = 4,
  STREET = 8,
  HOUSE = 12,
  OFFICE_NUM = 16,
  BUILDING = 20,
  CORPUS = 24,
  OTHER = 64,
}

export interface IAddressModel {
  id: number
  title: string
  address_type: IAddressEnumTypes
  address_type_name?: string
  parent_addr?: number
  parent_addr_title?: string
  fias_address_level: number
  fias_address_level_name?: string
  fias_address_type: number
  fias_address_type_name?: string
}
export type IAddressModelList = IDRFListResponse<IAddressModel>
export type IAddressModelListAxiosResponsePromise = IDRFAxiosResponsePromise<IAddressModelList>
export type IAddressModelPlainListAxiosResponsePromise = IDRFAxiosResponsePromise<IAddressModel[]>

export interface IAddressType {
  value: number
  label: string
}
export type IAddressTypeListAxiosResponsePromise = IDRFAxiosResponsePromise<IAddressType[]>

export interface IAddrLevelItem {
  value: number
  name: string
}
export type IAddrLevelItemsIDRFAxiosResponsePromise = IDRFAxiosResponsePromise<IAddrLevelItem[]>

export interface IAddrTypeItem {
  addr_code: number
  addr_short_name: string
  addr_name: string
}
export type IAddrTypeItemsIDRFAxiosResponsePromise = IDRFAxiosResponsePromise<IAddrTypeItem[]>

export type AddrTreeNode = TreeNode<number, IAddressModel>
