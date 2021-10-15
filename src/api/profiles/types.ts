/* eslint-disable camelcase */
import { IDRFListResponse, IDRFAxiosResponsePromise } from '@/api/types'
import { IBaseAccount } from '@/api/base_account'

export interface IUserProfile extends IBaseAccount {
  avatar: string
  email: string
  full_name?: string
  user_permissions: number[]
  access_level: number
}
export type IUserProfileAxoisResponsePromise = IDRFAxiosResponsePromise<IUserProfile>
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

export const DEFAULT_USER_AVA = '/img/user_ava_min.gif'

export interface IUserProfileAuthLog {
  id: number
  time: string
  remote_ip: string
  user_agent: string
  profile: number
}
export type IUserProfileAuthLogList = IDRFListResponse<IUserProfileAuthLog> | IDRFListResponse<IUserProfileAuthLog[]>
export type IUserProfileAuthLogListAxiosResponsePromise = IDRFAxiosResponsePromise<IUserProfileAuthLogList>
