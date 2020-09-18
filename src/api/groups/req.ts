import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import {
  IGroupListAxiosResponsePromise,
  IGroupAxoisResponsePromise,
  IGroup, IGroupList
} from './types'
import {
  IDRFRequestListParameters,
  IObjectGroupPermsInitial,
  IObjectGroupPermsInitialAxiosResponsePromise,
  IObjectGroupPermsResultStruct
} from '@/api/types'

export const getGroups = (params?: IDRFRequestListParameters): IGroupListAxiosResponsePromise =>
  request.get<IGroupList>('/groups/', { params })

export const getGroup = (groupId: number): IGroupAxoisResponsePromise =>
  request.get<IGroup>(`/groups/${groupId}/`)

export const addGroup = (newGroup: object): IGroupAxoisResponsePromise =>
  request.post<IGroup>('/groups/', newGroup)

export const changeGroup = (groupId: number, newData: object): IGroupAxoisResponsePromise =>
  request.patch<IGroup>(`/groups/${groupId}/`, newData)

export const delGroup = (groupId: number) =>
  request.delete(`/groups/${groupId}/`)

export const getObjectsPerms = (groupId: number): IObjectGroupPermsInitialAxiosResponsePromise =>
  request.get<IObjectGroupPermsInitial>(`/groups/${groupId}/get_object_perms/`)

export const setObjectsPerms = (groupId: number, dat: IObjectGroupPermsResultStruct) =>
  request.put(`/groups/${groupId}/set_object_perms/`, dat)

export const getGroupsSelectedObjectPerms = (groupId: number, profileGroupId: number): AxiosPromise<number[]> =>
  request.get(`/groups/${groupId}/get_selected_object_perms/${profileGroupId}/`)
