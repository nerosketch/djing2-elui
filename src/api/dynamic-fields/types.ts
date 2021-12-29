/* eslint-disable camelcase */
import {
  IDRFAxiosResponsePromise,
  IChoiceItemType,
  IChoiceItemTypeListAxiosResponsePromise
} from '@/api/types'

export interface IDynamicField {
  id: number
  title: string
  field_type: number
  field_type_name: string
  system_tag: number
  system_tag_name: string
  user_tag: string
  groups: number[]
}
export type IDynamicFieldList = IDynamicField[]

export interface IDynamicContentField {
  id?: number
  content?: string
  field: number
  title: string
}
export type IDynamicContentFieldList = IDynamicContentField[]
export type IDynamicContentFieldListAxiosResponsePromise = IDRFAxiosResponsePromise<IDynamicContentFieldList>

export type IDynamicFieldSystemTag = IChoiceItemType
export type IDynamicFieldSystemTagListAxiosResponsePromise = IChoiceItemTypeListAxiosResponsePromise
