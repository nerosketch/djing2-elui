import request from '@/utils/request'
import { IDRFRequestListParameters } from '@/api/types'
import { IUserSessionList, IUserSessionListAxiosResponsePromise } from './types'

const surl = '/radius/session/'

export const getSessionList = (params?: IDRFRequestListParameters): IUserSessionListAxiosResponsePromise =>
  request.get<IUserSessionList>(surl, { params })
