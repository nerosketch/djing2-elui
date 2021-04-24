import { IDRFAxiosResponsePromise, IDRFListResponse } from '@/api/types'

export interface IGroup {
  pk: number
  title: string
  sites?: number[]
}

export type IGroupList = IDRFListResponse<IGroup>
export type IGroupAxoisResponsePromise = IDRFAxiosResponsePromise<IGroup>
export type IGroupListAxiosResponsePromise = IDRFAxiosResponsePromise<IGroupList>

// export interface SetPermissionsRecursiveRequest {
//   permission_ids: number[]
//   profile_group: number
// }
