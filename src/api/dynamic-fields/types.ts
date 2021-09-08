/* eslint-disable camelcase */
import {
  IDRFAxiosResponsePromise
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
export type IDynamicFieldAxoisResponsePromise = IDRFAxiosResponsePromise<IDynamicField>
export type IDynamicFieldListAxiosResponsePromise = IDRFAxiosResponsePromise<IDynamicFieldList>

export interface IDynamicContentField {
  id?: number
  content?: string
  field: number
  title: string
}
export type IDynamicContentFieldList = IDynamicContentField[]
export type IDynamicContentFieldAxoisResponsePromise = IDRFAxiosResponsePromise<IDynamicContentField>
export type IDynamicContentFieldListAxiosResponsePromise = IDRFAxiosResponsePromise<IDynamicContentFieldList>

export interface IFieldChoiceType {
  value: number
  label: string
}
export type IFieldChoiceTypeListAxiosResponsePromise = IDRFAxiosResponsePromise<IFieldChoiceType[]>

export interface IDynamicFieldSystemTag extends IFieldChoiceType {
}
export type IDynamicFieldSystemTagListAxiosResponsePromise = IDRFAxiosResponsePromise<IDynamicFieldSystemTag[]>
