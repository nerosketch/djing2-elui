/* eslint-disable camelcase */
import { AxiosResponse, AxiosPromise } from 'axios'

export type IDRFListResponse<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface IDRFRequestListParameters {
  page?: number
  page_size?: number
  ordering?: string
  fields?: string
}

export type IDRFAxiosResponse<T> = AxiosResponse<T>
export type IDRFAxiosResponsePromise<T> = AxiosPromise<T>
export type IDRFAxiosResponseListPromise<T> = AxiosResponse<IDRFListResponse<T>>

// Simple response
export interface ISimpleResponseResult {
  text: string
  status: number
}
export type ISimpleResponseResultAxiosResponsePromise = IDRFAxiosResponsePromise<ISimpleResponseResult>

export interface IObjectGroupPermsResultStruct {
  groupId: number
  selectedPerms: number[]
}
// export type IObjectGroupPermsResultStructAxiosResponsePromise = IDRFAxiosResponsePromise<IObjectGroupPermsResultStruct>

// Permissions
export interface IPermission {
  id: number
  name: string
  content_type: IPermContentType | number
  codename: string
}

export interface IPermContentType {
  id: number
  app_label: string
  model: string
}
export type IPermContentTypeList = IDRFListResponse<IPermContentType>
export type IPermContentTypeListAxiosResponsePromise = IDRFAxiosResponsePromise<IPermContentTypeList>

export interface IGroupObjectPermission {
  group: number
  user: number
  content_type: IPermContentType | number
  object_pk: string
  content_object: number
}

export interface IPermissionGroup {
  name: string
  permissions: (IPermission | number)[]
}

export interface IUserObjectPermission {
  user: number
  content_type: IPermContentType | number
  object_pk: string
  content_object: number
  permission: number
}

export interface IObjectGroupPermsInitial {
  availablePerms: IPermission[]
}
export type IObjectGroupPermsInitialAxiosResponsePromise = IDRFAxiosResponsePromise<IObjectGroupPermsInitial>
// Report pie chart
export interface PieChartData {
  value: number
  name: string
}
export interface PieChartReport {
  labels: string[]
  data: PieChartData[]
}

export type StringAxiosResponsePromise = IDRFAxiosResponsePromise<string>

export interface IChoiceItemType {
  value: number
  label: string
}
export type IChoiceItemTypeListAxiosResponsePromise = IDRFAxiosResponsePromise<IChoiceItemType[]>
