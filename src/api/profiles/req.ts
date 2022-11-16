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
  IUserProfile, IUserProfileAxoisResponsePromise,
  IPasswordUpdateForm,
  IUserGroup,
  IUserProfilePlainListAxiosResponsePromise,
  IUserProfileAuthLogListAxiosResponsePromise,
  IUserProfileAuthLogList
} from '@/api/profiles/types'
import {
  addObjectDecorator,
  delObjectDecorator,
  getObjectDecorator,
  getObjectListDecorator,
  patchObjectDecorator
} from '@/api/baseRequests'

// IUserProfileLog
const baseLogUrl = '/profiles/log/'
export const getProfileLogs = (params?: IDRFRequestListParameters, account?: number): IUserProfileLogListAxiosResponsePromise =>
  request.get<IUserProfileLogList>(baseLogUrl, { params: Object.assign(params, { account }) })

export const getProfileLog = getObjectDecorator<IUserProfileLog>(baseLogUrl)
export const addProfileLog = addObjectDecorator<IUserProfileLog>(baseLogUrl)
export const changeProfileLog = patchObjectDecorator<IUserProfileLog>(baseLogUrl)
export const delProfileLog = delObjectDecorator<IUserProfileLog>(baseLogUrl)

// IUserProfile
const baseAccUrl = '/profiles/'
export const getProfiles = getObjectListDecorator<IUserProfile>(baseAccUrl)

export const getActiveProfiles = (params?: IDRFRequestListParameters): IUserProfilePlainListAxiosResponsePromise =>
  request.get<IUserProfile[]>(`${baseAccUrl}get_active_profiles/`, { params })

export const getProfile = (uname: string): IUserProfileAxoisResponsePromise =>
  request.get<IUserProfile>(`${baseAccUrl}${uname}/`)

export const getSelfProfile = (): IUserProfileAxoisResponsePromise =>
  request.get<IUserProfile>(`${baseAccUrl}current/`)

export const addProfile = addObjectDecorator<IUserProfile>(baseAccUrl)

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

export const setProfilePassword = (uname: string, newPassw: IPasswordUpdateForm): IDRFAxiosResponsePromise<string> =>
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

const usrGrpUrl = '/profiles/perms/groups/'
export const getUserGroups = getObjectListDecorator<IUserGroup>(usrGrpUrl)
export const getUserGroup = getObjectDecorator<IUserGroup>(usrGrpUrl)
export const patchUserGroup = patchObjectDecorator<IUserGroup>(usrGrpUrl)
export const addUserGroup = addObjectDecorator<IUserGroup>(usrGrpUrl)
export const delUserGroup = delObjectDecorator<IUserGroup>(usrGrpUrl)

export const getCurrentAuthPermissions = (): AxiosPromise<string[]> =>
  request.get<string[]>('/profiles/get_current_auth_permissions/')

export const getAuthLog = (params?: IDRFRequestListParameters, profile?: number): IUserProfileAuthLogListAxiosResponsePromise =>
  request.get<IUserProfileAuthLogList>('/profiles/auth-log/', { params: Object.assign(params, { profile }) })
