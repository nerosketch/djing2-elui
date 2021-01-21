/* eslint-disable camelcase */
import { IDRFAxiosResponsePromise, IDRFListResponse } from '@/api/types'

export interface IGateway {
  id: number
  title: string
  ip_address: string
  ip_port: number
  auth_login: string
  auth_passw: string
  gw_type: number
  is_default: boolean
  enabled: boolean
  customers_count?: number
  sites?: number[]
}

export type IGatewayList = IDRFListResponse<IGateway>
export type IGatewayAxoisResponsePromise = IDRFAxiosResponsePromise<IGateway>
export type IGatewayListAxiosResponsePromise = IDRFAxiosResponsePromise<IGatewayList>
