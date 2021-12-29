import request from '@/utils/request'
import { IDRFRequestListParameters } from '@/api/types'
import {
  IUserSessionList,
  IUserSession,
  IUserSessionListAxiosResponsePromise,
  IUserSessionAxoisResponsePromise
} from './types'
import { delObjectDecorator, getObjectListDecorator } from '@/api/baseRequests'

const surl = '/radius/session/'

export const getSessionList = getObjectListDecorator<IUserSession>(surl)

export const getGuestSessionList = (params?: IDRFRequestListParameters): IUserSessionListAxiosResponsePromise =>
  request.get<IUserSessionList>(`${surl}guest_list/`, { params })

// export const getSession = (id: number): IUserSessionAxoisResponsePromise =>
// request.get<IUserSession>(`${surl}${id}/`)

export const getSessionByLease = (leaseId: number): IUserSessionAxoisResponsePromise =>
  request.get<IUserSession>(`${surl}get_by_lease/${leaseId}/`)

export const delSession = delObjectDecorator<IUserSession>(surl)

export const sessionRequestFree = (sessionId: number) =>
  request.post(`${surl}${sessionId}/free_session_request/`)
