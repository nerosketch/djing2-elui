import request from '@/utils/request'
import {
  IPayBaseGateway,
  IAllTimePayLogList,
  IAllTimePayLogListAxiosResponsePromise,
  IPayReportList,
  IPayReport,
  IPayReportParams,
  IPayAllTimeGateway,
  IPayRNCBGateway,
  IPayPaymeGateway
} from './types'
import {
  addObjectDecorator,
  delObjectDecorator,
  getObjectDecorator,
  getObjectListDecorator,
  patchObjectDecorator
} from '@/api/baseRequests'


const pgwUrl = '/fin/base/'
export const getPayGateways = getObjectListDecorator<IPayBaseGateway>(pgwUrl)
export const getPayGateway = getObjectDecorator<IPayBaseGateway>(pgwUrl)
export const addPayGateway = addObjectDecorator<IPayBaseGateway>(pgwUrl)
export const changePayGateway = patchObjectDecorator<IPayBaseGateway>(pgwUrl)
export const delPayGateway = delObjectDecorator<IPayBaseGateway>(pgwUrl)

const pgwATUrl = '/fin/alltime/'
export const getATPayGateway = getObjectDecorator<IPayAllTimeGateway>(pgwATUrl)
export const addATPayGateway = addObjectDecorator<IPayAllTimeGateway>(pgwATUrl)
export const changeATPayGateway = patchObjectDecorator<IPayBaseGateway>(pgwATUrl)
export const delATPayGateway = delObjectDecorator<IPayBaseGateway>(pgwATUrl)

const pgwRNCBUrl = '/fin/rncb/'
export const getRNCBPayGateway = getObjectDecorator<IPayRNCBGateway>(pgwRNCBUrl)
export const addRNCBPayGateway = addObjectDecorator<IPayRNCBGateway>(pgwRNCBUrl)
export const changeRNCBPayGateway = patchObjectDecorator<IPayRNCBGateway>(pgwRNCBUrl)
export const delRNCBPayGateway = delObjectDecorator<IPayRNCBGateway>(pgwRNCBUrl)

const pgwPaymeUrl = '/fin/payme/'
export const getPaymePayGateway = getObjectDecorator<IPayPaymeGateway>(pgwPaymeUrl)
export const addPaymePayGateway = addObjectDecorator<IPayPaymeGateway>(pgwPaymeUrl)
export const changePaymePayGateway = patchObjectDecorator<IPayPaymeGateway>(pgwPaymeUrl)
export const delPaymePayGateway = delObjectDecorator<IPayPaymeGateway>(pgwPaymeUrl)

export const getPayLog = (): IAllTimePayLogListAxiosResponsePromise =>
  request.get<IAllTimePayLogList>(`${pgwUrl}log/`)

export const getPayReport = (params: IPayReportParams, mimeType='application/json'): IPayReportList =>
  request.get<IPayReport[]>(`${pgwUrl}pays_report/`, {
    params,
    headers: {
      Accept: mimeType
    }
 })
