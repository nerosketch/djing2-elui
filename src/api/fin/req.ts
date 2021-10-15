import request from '@/utils/request'
import {
  IPayAllTimeGateway,
  IAllTimePayLogList,
  IAllTimePayLogListAxiosResponsePromise,
  IPayReportList,
  IPayReport,
  IPayReportParams
} from './types'
import {
  addObjectDecorator,
  delObjectDecorator,
  getObjectDecorator,
  getObjectListDecorator,
  patchObjectDecorator
} from '@/api/baseRequests'


const pgwUrl = '/fin/'
export const getPayGateways = getObjectListDecorator<IPayAllTimeGateway>(pgwUrl)
export const getPayGateway = getObjectDecorator<IPayAllTimeGateway>(pgwUrl)
export const addPayGateway = addObjectDecorator<IPayAllTimeGateway>(pgwUrl)
export const changePayGateway = patchObjectDecorator<IPayAllTimeGateway>(pgwUrl)
export const delPayGateway = delObjectDecorator<IPayAllTimeGateway>(pgwUrl)

export const getPayLog = (): IAllTimePayLogListAxiosResponsePromise =>
  request.get<IAllTimePayLogList>(`${pgwUrl}log/`)

export const getPayReport = (params: IPayReportParams): IPayReportList =>
  request.get<IPayReport[]>('/fin/pays_report/', { params })
