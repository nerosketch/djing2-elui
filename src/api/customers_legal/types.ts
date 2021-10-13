/* eslint-disable camelcase */
import {
  IDRFAxiosResponsePromise,
  IDRFListResponse,
} from '@/api/types'
import { IBaseAccount } from '../base_account'

// CustomerLegalModel
export interface ICustomerLegal extends IBaseAccount {
  group: number
  branches: number[]
  balance: number
  address: number

  tax_number: string
  post_index: string
  actual_start_time: string
  actual_end_time: string
  title: string
  description: string
}
export type ICustomerLegalList = IDRFListResponse<ICustomerLegal>
export type ICustomerLegalAxoisResponsePromise = IDRFAxiosResponsePromise<ICustomerLegal>
export type ICustomerLegalListAxiosResponsePromise = IDRFAxiosResponsePromise<ICustomerLegalList>

export interface ICustomerLegalBank {
  id: number
  legal_customer: number
  title: string
  post_index: string
  number: string
}

export interface ICustomerLegalPost {
  id: number
  legal_customer: number
  post_index: string
  office_num: string
  address: number
}

export interface ICustomerLegalDeliveryAddress {
  id: number
  legal_customer: number
  address: number
}

export interface ICustomerLegalTelephoneNumber {
  id: number
  legal_customer: number
  telephone: string
  owner_name: string
  create_time: string
  last_change_time: string
}
