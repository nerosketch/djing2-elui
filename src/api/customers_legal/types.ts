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

  legal_type: number

  tax_number: string              // ИНН
  state_level_reg_number: string  // ОГРН
  post_index: string
  actual_start_time: string
  actual_end_time: string | null
  title: string
  description: string
}
export type ICustomerLegalAxoisResponsePromise = IDRFAxiosResponsePromise<ICustomerLegal>

export interface ICustomerLegalBank {
  id: number
  legal_customer: number
  title: string                  // Название банка
  post_index: string
  number: string                 // Номер счёта в банке
  bank_code: string              // БИК
  correspondent_account: string  // корреспондентский счёт
  settlement_account: string     // расчётный счёт
}
export type ICustomerLegalBankList = IDRFListResponse<ICustomerLegalBank>
export type ICustomerLegalBankAxoisResponsePromise = IDRFAxiosResponsePromise<ICustomerLegalBank>
export type ICustomerLegalBankListAxiosResponsePromise = IDRFAxiosResponsePromise<ICustomerLegalBankList>


export interface ICustomerLegalPost {
  id: number
  legal_customer: number
  post_index: string
  address: number
}
export type ICustomerLegalPostList = IDRFListResponse<ICustomerLegalPost>
export type ICustomerLegalPostAxoisResponsePromise = IDRFAxiosResponsePromise<ICustomerLegalPost>
export type ICustomerLegalPostListAxiosResponsePromise = IDRFAxiosResponsePromise<ICustomerLegalPostList>


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
