import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import {
  IDRFRequestListParameters,
  IDRFAxiosResponsePromise,
  IPermission,
  IPermContentTypeListAxiosResponsePromise,
  IPermContentTypeList
} from '@/api/types'
import {
  IUserProfileLogListAxiosResponsePromise,
  IUserProfileLogList, IUserProfileLog,
  IUserProfileLogAxoisResponsePromise,
  IUserProfileList, IUserProfileListAxiosResponsePromise,
  IUserProfile, IUserProfileAxoisResponsePromise,
  IPasswordUpdateForm,
  IUserGroupListAxiosResponsePromise,
  IUserGroupList,
  IUserGroupAxoisResponsePromise,
  IUserGroup,
  IUserProfilePlainListAxiosResponsePromise,
  IUserProfileAuthLogListAxiosResponsePromise,
  IUserProfileAuthLogList
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

export const getActiveProfiles = (params?: IDRFRequestListParameters): IUserProfilePlainListAxiosResponsePromise =>
  request.get<IUserProfile[]>(`${baseAccUrl}get_active_profiles/`, { params })

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

export const changeAvatar = (uname: string, ava: HTMLImageElement): IUserProfileAxoisResponsePromise => {
  const formData = new FormData()
  formData.append('avatar', ava as any)
  return request.patch<IUserProfile>(`${baseAccUrl}${uname}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

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
  request.get<IPermContentTypeList>('/profiles/perms/content-types/')

export const getUserGroups = (params?: IDRFRequestListParameters): IUserGroupListAxiosResponsePromise =>
  request.get<IUserGroupList>('/profiles/perms/groups/', { params })

export const getUserGroup = (id: number): IUserGroupAxoisResponsePromise =>
  request.get<IUserGroup>(`/profiles/perms/groups/${id}/`)

export const patchUserGroup = (id: number, info: object): IUserGroupAxoisResponsePromise =>
  request.patch<IUserGroup>(`/profiles/perms/groups/${id}/`, info)

export const addUserGroup = (info: object): IUserGroupAxoisResponsePromise =>
  request.post<IUserGroup>(`/profiles/perms/groups/`, info)

export const delUserGroup = (id: number) =>
  request.delete<IUserGroup>(`/profiles/perms/groups/${id}/`)

export const getCurrentAuthPermissions = (): AxiosPromise<string[]> =>
  request.get<string[]>('/profiles/get_current_auth_permissions/')

export const getAuthLog = (params?: IDRFRequestListParameters, profile?: number): IUserProfileAuthLogListAxiosResponsePromise =>
  request.get<IUserProfileAuthLogList>('/profiles/auth-log/', { params: Object.assign(params, { profile }) })
