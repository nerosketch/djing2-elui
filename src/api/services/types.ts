import { IDRFAxiosResponsePromise, IDRFListResponse } from '../types'

export enum IServiceTypeEnum {
  BASE = 0,
  IS = 1,
  LONG = 2,
  DAILY = 3
}

// IService
export interface IService {
  pk: number
  title: string
  descr: string
  speed_in: number
  speed_out: number
  speed_burst: number
  cost: number
  calc_type: IServiceTypeEnum
  is_admin: boolean
  usercount: number
  planned_deadline: Date
  calc_type_name: string
}
export type IServiceList = IDRFListResponse<IService>
export type IServiceAxoisResponsePromise = IDRFAxiosResponsePromise<IService>
export type IServiceListAxiosResponsePromise = IDRFAxiosResponsePromise<IServiceList>

// IPeriodicPay
export interface IPeriodicPay {
  pk: number
  name: string
  when_add?: string
  amount: number
}
export type IPeriodicPayList = IDRFListResponse<IPeriodicPay>
export type IPeriodicPayAxoisResponsePromise = IDRFAxiosResponsePromise<IPeriodicPay>
export type IPeriodicPayListAxiosResponsePromise = IDRFAxiosResponsePromise<IPeriodicPayList>

// IOneShotPay
export interface IOneShotPay {
  pk: number
  name: string
  cost: number
}
export type IOneShotPayPayList = IDRFListResponse<IOneShotPay>
export type IOneShotPayPayAxoisResponsePromise = IDRFAxiosResponsePromise<IOneShotPay>
export type IOneShotPayPayListAxiosResponsePromise = IDRFAxiosResponsePromise<IOneShotPayPayList>
