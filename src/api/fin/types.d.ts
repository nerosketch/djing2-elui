/* eslint-disable camelcase */
import { IDRFAxiosResponsePromise, IDRFListResponse } from '@/api/types'

export interface IPayAllTimeGateway {
  id: number
  title: string
  secret: string
  service_id: string
  slug: string
  pay_count: number
  sites?: number[]
}
export type IPayAllTimeGatewayList = IDRFListResponse<IPayAllTimeGateway>
export type IPayAllTimeGatewayAxoisResponsePromise = IDRFAxiosResponsePromise<IPayAllTimeGateway>
export type IPayAllTimeGatewayListAxiosResponsePromise = IDRFAxiosResponsePromise<IPayAllTimeGatewayList>

export interface IAllTimePayLog {
  customer: number
  pay_id: string
  date_add: string
  sum: number
  trade_point: string
  receipt_num: number
  pay_gw: number
}
export type IAllTimePayLogList = IDRFListResponse<IAllTimePayLog>
export type IAllTimePayLogListAxiosResponsePromise = IDRFAxiosResponsePromise<IAllTimePayLogList>

export interface IPayReport {
  summ: number
  pay_date: string
  pay_count: number
}
export type IPayReportList = IDRFAxiosResponsePromise<IPayReport[]>

export interface IPayReportParams {
  from_date: string,
  pay_gw: number,
  group_by_day: boolean,
  group_by_mon: boolean,
  group_by_week: boolean
}
