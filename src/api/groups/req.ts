import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import {
  IObjectGroupPermsInitial,
  IObjectGroupPermsInitialAxiosResponsePromise,
  IObjectGroupPermsResultStruct
} from '@/api/types'
import { IGroup } from './types'
import {
  addObjectDecorator,
  delObjectDecorator,
  getObjectDecorator,
  getObjectListDecorator,
  patchObjectDecorator
} from '@/api/baseRequests'

const grpUrl = '/groups/'
export const getGroups = getObjectListDecorator<IGroup>(grpUrl)
export const getGroup = getObjectDecorator<IGroup>(grpUrl)
export const addGroup = addObjectDecorator<IGroup>(grpUrl)
export const changeGroup = patchObjectDecorator<IGroup>(grpUrl)
export const delGroup = delObjectDecorator<IGroup>(grpUrl)

// export const setGroupsPermissionsRecursive = (groupId: number, req: SetPermissionsRecursiveRequest) =>
//   request.put(`/groups/${groupId}/set_related_perms_recursive/`, req)

// export const getGroupAllRelatedPerms = (): AxiosPromise<IPermission[]> =>
//   request.get('/groups/get_all_related_perms/')

export const getGroupObjectsPerms = (groupId: number): IObjectGroupPermsInitialAxiosResponsePromise =>
  request.get<IObjectGroupPermsInitial>(`/groups/${groupId}/get_object_perms/`)

export const setGroupObjectsPerms = (groupId: number, dat: IObjectGroupPermsResultStruct) =>
  request.put(`/groups/${groupId}/set_object_perms/`, dat)

export const getGroupSelectedObjectPerms = (groupId: number, profileGroupId: number): AxiosPromise<number[]> =>
  request.get(`/groups/${groupId}/get_selected_object_perms/${profileGroupId}/`)
