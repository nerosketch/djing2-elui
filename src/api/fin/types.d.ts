/* eslint-disable camelcase */
import { IDRFAxiosResponsePromise, IDRFListResponse } from '@/api/types'

export interface IPayBaseGateway {
  id: number
  payment_type: number
  title: string
  slug: string
  pay_count: number
  sites?: number[]
}

export interface IPayAllTimeGateway extends IPayBaseGateway {
  secret: string
  service_id: string
}

export interface IBasePaymentLog {
  customer: number
  pay_gw: number
  date_add: string
  amount: number
}

export interface IPayRNCBGateway extends IPayBaseGateway {
}

export interface IAllTimePayLog extends IBasePaymentLog {
  pay_id: string
  trade_point: string
  receipt_num: number
}
export type IAllTimePayLogList = IDRFListResponse<IAllTimePayLog>
export type IAllTimePayLogListAxiosResponsePromise = IDRFAxiosResponsePromise<IAllTimePayLogList>

export interface IPayReport {
  summ: number
  pay_count: number
  [field: string]: string | number | null
}
export type IPayReportList = IDRFAxiosResponsePromise<IPayReport[]>

export interface IPayReportParams {
  from_time: string,
  to_time: string,
  pay_gw: number,
  group_by: number,
  limit: number
}

export type IPayPaymeGateway = IPayBaseGateway
