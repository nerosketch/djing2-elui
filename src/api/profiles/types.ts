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
}
export type IUserProfileList = IDRFListResponse<IUserProfile>
export type IUserProfileAxoisResponsePromise = IDRFAxiosResponsePromise<IUserProfile>
export type IUserProfileListAxiosResponsePromise = IDRFAxiosResponsePromise<IUserProfileList>

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

// Permissions
export interface IUserObjectPermission {
  user: number
  content_type: IPermContentType | number
  object_pk: string
  content_object: number
  permission: number
}

export interface IGroupObjectPermission {
  group: number
  user: number
  content_type: IPermContentType | number
  object_pk: string
  content_object: number
}

export interface IPermContentType {
  id: number
  app_label: string
  model: string
}
export type IPermContentTypeList = IDRFListResponse<IPermContentType>
export type IPermContentTypeListAxiosResponsePromise = IDRFAxiosResponsePromise<IPermContentTypeList>

export interface IPermission {
  id: number
  name: string
  content_type: IPermContentType | number
  codename: string
}

export interface IPermissionGroup {
  name: string
  permissions: (IPermission | number)[]
}
