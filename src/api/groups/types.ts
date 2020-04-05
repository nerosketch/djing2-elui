import { IDRFAxiosResponsePromise, IDRFListResponse } from '../types'

export interface IGroup {
  pk: number
  title: string
  code: string
}

export type IGroupList = IDRFListResponse<IGroup>

export type IGroupAxoisResponsePromise = IDRFAxiosResponsePromise<IGroup>
export type IGroupListAxiosResponsePromise = IDRFAxiosResponsePromise<IGroupList>
