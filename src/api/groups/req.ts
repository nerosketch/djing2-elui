import request from '@/utils/request'
import { IGroupListAxiosResponsePromise, IGroupAxoisResponsePromise, IGroup, IGroupList } from './types'
import { IDRFRequestListParameters } from '@/api/types'

export const getGroups = (params: IDRFRequestListParameters): IGroupListAxiosResponsePromise =>
  request.get<IGroupList>('/groups/', { params })

export const getGroup = (groupId: number): IGroupAxoisResponsePromise =>
  request.get<IGroup>(`/groups/${groupId}/`)

export const addGroup = (newGroup: IGroup): IGroupAxoisResponsePromise =>
  request.post<IGroup>('/groups/', newGroup)

export const changeGroup = (groupId: number, newData: IGroup): IGroupAxoisResponsePromise =>
  request.put<IGroup>(`/groups/${groupId}/`, newData)

export const delGroup = (groupId: number) =>
  request({
    url: `/groups/${groupId}/`,
    method: 'delete'
  })
