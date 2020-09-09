import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { IDRFRequestListParameters, IDRFAxiosResponsePromise } from '@/api/types'
import {
  IUserProfileLogListAxiosResponsePromise,
  IUserProfileLogList, IUserProfileLog,
  IUserProfileLogAxoisResponsePromise,
  IUserProfileList, IUserProfileListAxiosResponsePromise,
  IUserProfile, IUserProfileAxoisResponsePromise,
  IPasswordUpdateForm,
  IPermContentTypeListAxiosResponsePromise,
  IPermContentTypeList,
  IPermission
} from '@/api/profiles/types'

// IUserProfileLog
const baseLogUrl = '/profiles/log/'
export const getProfileLogs = (params?: IDRFRequestListParameters, account?: number): IUserProfileLogListAxiosResponsePromise =>
  request.get<IUserProfileLogList>(baseLogUrl, { params: Object.assign(params, { account }) })

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

export const getActiveProfiles = (params?: IDRFRequestListParameters): IUserProfileListAxiosResponsePromise =>
  request.get<IUserProfileList>(`${baseAccUrl}get_active_profiles/`, { params })

export const getProfile = (uname: string): IUserProfileAxoisResponsePromise =>
  request.get<IUserProfile>(`${baseAccUrl}${uname}/`)

export const getSelfProfile = (): IUserProfileAxoisResponsePromise =>
  request.get<IUserProfile>(`${baseAccUrl}current/`)

export const addProfile = (data: object): IUserProfileAxoisResponsePromise =>
  request.post<IUserProfile>(baseAccUrl, data)

export const changeProfile = (uname: string, newData: object): IUserProfileAxoisResponsePromise =>
  request.patch<IUserProfile>(`${baseAccUrl}${uname}/`, newData)

export const delProfile = (uname: string) =>
  request.delete(`${baseAccUrl}${uname}/`)

export const getProfilesByGroup = (groupId: number): IDRFAxiosResponsePromise<number[]> =>
  request.get(`${baseAccUrl}get_profiles_by_group/${groupId}/`)

export const getResponsibilityGroups = (uname: string): IDRFAxiosResponsePromise<number[]> =>
  request.get(`${baseAccUrl}${uname}/get_responsibility_groups/`)

export const setResponsibilityGroups = (uname: string, groups: number[]) =>
  request.put(`${baseAccUrl}${uname}/set_responsibility_groups/`, { groups })

export const setProfilePassword = (uname: string, newPassw: IPasswordUpdateForm) =>
  request.put(`${baseAccUrl}${uname}/change_password/`, newPassw)

export const login = (data: any) =>
  request({
    url: '/profiles/token-auth/',
    method: 'post',
    data
  })

export const logout = () =>
  request({
    url: '/profiles/logout/',
    method: 'post'
  })

export const getAllPermissions = (): AxiosPromise<IPermission[]> =>
  request.get('/profiles/perms/', {
    params: {
      page: 1,
      page_size: 0
    }
  })

export const getAllContentTypes = (): IPermContentTypeListAxiosResponsePromise =>
  request.get<IPermContentTypeList>('/perms/content-types/')
