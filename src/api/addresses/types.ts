/* eslint-disable camelcase */
import {
  IDRFAxiosResponsePromise,
  IDRFListResponse
} from '@/api/types'

export interface IAddressModel {
  id: number
  title: string
}
export type IAddressModelList = IDRFListResponse<IAddressModel>
export type IAddressModelAxoisResponsePromise = IDRFAxiosResponsePromise<IAddressModel>
export type IAddressModelListAxiosResponsePromise = IDRFAxiosResponsePromise<IAddressModelList>

export interface IAddressType {
  value: number
  label: string
}
export type IAddressTypeListAxiosResponsePromise = IDRFAxiosResponsePromise<IAddressType[]>
