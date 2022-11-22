/* eslint-disable camelcase */
import {
  IDRFAxiosResponsePromise,
  IDRFListResponse,
  IDRFRequestListParameters
} from '@/api/types'

export enum IServiceTypeEnum {
  BASE = 0,
  IS = 1,
  LONG = 2,
  DAILY = 3
}

// IService
export interface IService {
  id: number
  title: string
  descr: string
  speed_in: number
  speed_out: number
  speed_burst: number
  cost: number
  calc_type: IServiceTypeEnum
  is_admin: boolean
  usercount: number
  planned_deadline: string
  calc_type_name: string
  sites?: number[]
}
export type IServiceList = IDRFListResponse<IService>
export type IServiceListAxiosResponsePromise = IDRFAxiosResponsePromise<IServiceList> | IDRFAxiosResponsePromise<IService[]>

export interface IDRFRequestListParametersService extends IDRFRequestListParameters {
  groups: number
}

// IPeriodicPay
export interface IPeriodicPay {
  id: number
  name: string
  when_add?: string
  amount: number
  sites?: number[]
}

// IOneShotPay
export interface IOneShotPay {
  id: number
  name: string
  cost: number
  sites?: number[]
}

// CustomerServiceConnectingQueueModel
export interface ICustomerServiceConnectingQueue {
  customer_id: number
  service_id: number
}
export interface ICustomerServiceConnectingQueueResponse extends ICustomerServiceConnectingQueue {
  id: number
  number_queue: number
  service_title: string
}

export type ICustomerServiceConnectingQueueListResponsePromise = IDRFAxiosResponsePromise<ICustomerServiceConnectingQueueResponse[]>
