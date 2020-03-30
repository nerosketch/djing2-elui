import { IDRFAxiosResponsePromise, IDRFListResponse } from '../types'

export interface IGroup {
  pk: number
  title: string
  code: string

  GetGroup?: (groupId: number) => IGroupAxoisResponsePromise
  AddGroup?: (data: IGroup) => IGroupAxoisResponsePromise
  SaveGroup?: () => IGroupAxoisResponsePromise
  DelGroup?: (groupId: number) => void
}

export type IGroupList = IDRFListResponse<IGroup>

export type IGroupAxoisResponsePromise = IDRFAxiosResponsePromise<IGroup>
export type IGroupListAxiosResponsePromise = IDRFAxiosResponsePromise<IGroupList>
