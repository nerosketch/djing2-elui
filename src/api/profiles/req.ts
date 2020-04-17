import request from '@/utils/request'
import { IDRFRequestListParameters, IDRFAxiosResponsePromise } from '@/api/types'
import { IUserProfileLogListAxiosResponsePromise, IUserProfileLogList, IUserProfileLog, IUserProfileLogAxoisResponsePromise, IUserProfileList, IUserProfileListAxiosResponsePromise, IUserProfile, IUserProfileAxoisResponsePromise } from './types'


// IUserProfileLog
const baseLogUrl = '/profiles/log/'
export const getProfileLogs = (params?: IDRFRequestListParameters): IUserProfileLogListAxiosResponsePromise =>
  request.get<IUserProfileLogList>(baseLogUrl, { params })

export const getProfileLog = (id: number): IUserProfileLogAxoisResponsePromise =>
  request.get<IUserProfileLog>(`${baseLogUrl}${id}/`)

export const addProfileLog = (data: object): IUserProfileLogAxoisResponsePromise =>
  request.post<IUserProfileLog>(baseLogUrl, data)

export const changeProfileLog = (id: number, newData: object): IUserProfileLogAxoisResponsePromise =>
  request.patch<IUserProfileLog>(`${baseLogUrl}${id}/`, newData)

export const delProfileLog = (id: number) =>
  request.delete(`${baseLogUrl}${id}/`)


// IUserProfile
const baseAccUrl = '/profiles/'
export const getProfiles = (params?: IDRFRequestListParameters): IUserProfileListAxiosResponsePromise =>
  request.get<IUserProfileList>(baseAccUrl, { params })

export const getProfile = (id: number): IUserProfileAxoisResponsePromise =>
  request.get<IUserProfile>(`${baseAccUrl}${id}/`)

export const addProfile = (data: object): IUserProfileAxoisResponsePromise =>
  request.post<IUserProfile>(baseAccUrl, data)

export const changeProfile = (id: number, newData: object): IUserProfileAxoisResponsePromise =>
  request.patch<IUserProfile>(`${baseAccUrl}${id}/`, newData)

export const delProfile = (id: number) =>
  request.delete(`${baseAccUrl}${id}/`)

export const getResponsibilities4Group = (groupId: number): IDRFAxiosResponsePromise<number[]> =>
  request.get(`${baseAccUrl}get_responsibilities/${groupId}/`)
