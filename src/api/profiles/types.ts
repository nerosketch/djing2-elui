import { IDRFListResponse, IDRFAxiosResponsePromise } from '@/api/types'

export interface IUserProfile {
  pk: number
  username: string
  fio: string
  birth_day: string
  is_active: boolean
  is_admin: boolean
  telephone: string
  avatar: string
  email: string
  full_name?: string
  last_login?: string
  is_superuser?: boolean
  token: string
  user_permissions: number[]
  groups: number[]
  access_level: number
  sites?: number[]
}
export type IUserProfileList = IDRFListResponse<IUserProfile>
export type IUserProfileAxoisResponsePromise = IDRFAxiosResponsePromise<IUserProfile>
export type IUserProfileListAxiosResponsePromise = IDRFAxiosResponsePromise<IUserProfileList>
export type IUserProfilePlainListAxiosResponsePromise = IDRFAxiosResponsePromise<IUserProfile[]>

export enum IUSER_PROFILE_LOG_ACTION_TYPES {
  UNDEFINED = 0,
  CREATE_USER = 1,
  DELETE_USER = 2,
  CREATE_DEVICE = 3,
  DELETE_DEVICE = 4,
  CREATE_GW = 5,
  DELETE_GW = 6,
  CREATE_SERVICE = 7,
  DELETE_SERVICE = 8
}

export interface IUserProfileLog {
  do_type: IUSER_PROFILE_LOG_ACTION_TYPES
  additional_text: string
  action_date: string
}
export type IUserProfileLogList = IDRFListResponse<IUserProfileLog>
export type IUserProfileLogAxoisResponsePromise = IDRFAxiosResponsePromise<IUserProfileLog>
export type IUserProfileLogListAxiosResponsePromise = IDRFAxiosResponsePromise<IUserProfileLogList>

export interface IPasswordUpdateForm {
  old_passw: string
  new_passw: string
}

export interface IUserGroup {
  id: number
  name: string
  permissions: number[]
}
export type IUserGroupList = IDRFListResponse<IUserGroup>
export type IUserGroupAxoisResponsePromise = IDRFAxiosResponsePromise<IUserGroup>
export type IUserGroupListAxiosResponsePromise = IDRFAxiosResponsePromise<IUserGroupList>
