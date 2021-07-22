import request from '@/utils/request'
import {
  IPayAllTimeGateway,
  IPayAllTimeGatewayList,
  IPayAllTimeGatewayAxoisResponsePromise,
  IPayAllTimeGatewayListAxiosResponsePromise,
  IAllTimePayLogList,
  IAllTimePayLogListAxiosResponsePromise,
  IPayReportList,
  IPayReport,
  IPayReportParams
} from './types'
import { IDRFRequestListParameters } from '@/api/types'

const pgwUrl = '/fin/'

export const getPayGateways = (params?: IDRFRequestListParameters): IPayAllTimeGatewayListAxiosResponsePromise =>
  request.get<IPayAllTimeGatewayList>(pgwUrl, { params })

export const getPayGateway = (gwId: number): IPayAllTimeGatewayAxoisResponsePromise =>
  request.get<IPayAllTimeGateway>(`${pgwUrl}${gwId}/`)

export const addPayGateway = (newPayGw: object): IPayAllTimeGatewayAxoisResponsePromise =>
  request.post<IPayAllTimeGateway>(pgwUrl, newPayGw)

export const changePayGateway = (gwId: number, newData: object): IPayAllTimeGatewayAxoisResponsePromise =>
  request.patch<IPayAllTimeGateway>(`${pgwUrl}${gwId}/`, newData)

export const delPayGateway = (gwId: number) =>
  request.delete(`${pgwUrl}${gwId}/`)

export const getPayLog = (): IAllTimePayLogListAxiosResponsePromise =>
  request.get<IAllTimePayLogList>(`${pgwUrl}log/`)

export const getPayReport = (params: IPayReportParams): IPayReportList =>
  request.get<IPayReport[]>('/fin/pays_report/', { params })
