/* eslint-disable camelcase */
import {
  IDRFAxiosResponsePromise
} from '@/api/types'

export interface IDynamicField {
  id: number
  title: string
  field_type: number
  field_type_name: string
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
