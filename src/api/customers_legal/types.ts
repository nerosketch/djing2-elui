/* eslint-disable camelcase */
import {
  IDRFAxiosResponsePromise,
} from '@/api/types'
import { IBaseAccount } from '../base_account'

// CustomerLegalModel
export interface ICustomerLegal extends IBaseAccount {
  group: number
  branches: number[]
  balance: number
  address: number
  post_index: string

  delivery_address: number
  delivery_address_post_index: string

  post_post_index: string
  post_address: number

  legal_type: number

  tax_number: string              // ИНН
  state_level_reg_number: string  // ОГРН
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
  number: string                 // Номер счёта в банке
  bank_code: string              // БИК
  correspondent_account: string  // корреспондентский счёт
  settlement_account: string     // расчётный счёт
}
export type ICustomerLegalBankAxoisResponsePromise = IDRFAxiosResponsePromise<ICustomerLegalBank>


export interface ICustomerLegalPost {
  id: number
  legal_customer: number
  post_index: string
  address: number
}
export type ICustomerLegalPostAxoisResponsePromise = IDRFAxiosResponsePromise<ICustomerLegalPost>


export interface ICustomerLegalDeliveryAddress {
  id: number
  legal_customer: number
  address: number
}
export type ICustomerLegalDeliveryAddressAxoisResponsePromise = IDRFAxiosResponsePromise<ICustomerLegalDeliveryAddress>


export interface ICustomerLegalTelephoneNumber {
  id: number
  legal_customer: number
  telephone: string
  owner_name: string
  create_time: string
  last_change_time: string
}
