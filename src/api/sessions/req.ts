import request from '@/utils/request'
import { IDRFRequestListParameters } from '@/api/types'
import {
  IUserSessionList,
  IUserSession,
  IUserSessionListAxiosResponsePromise,
  IUserSessionAxoisResponsePromise
} from './types'

const surl = '/radius/session/'

export const getSessionList = (params?: IDRFRequestListParameters): IUserSessionListAxiosResponsePromise =>
  request.get<IUserSessionList>(surl, { params })

export const getGuestSessionList = (params?: IDRFRequestListParameters): IUserSessionListAxiosResponsePromise =>
  request.get<IUserSessionList>(`${surl}guest_list/`, { params })

// export const getSession = (id: number): IUserSessionAxoisResponsePromise =>
  // request.get<IUserSession>(`${surl}${id}/`)

export const getSessionByLease = (leaseId: number): IUserSessionAxoisResponsePromise =>
  request.get<IUserSession>(`${surl}get_by_lease/${leaseId}/`)

export const delSession = (id: number) =>
  request.delete(`${surl}${id}/`)

export const sessionRequestFree = (sessionId: number) =>
  request.post(`${surl}${sessionId}/free_session_request/`)

