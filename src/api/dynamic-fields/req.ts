import request from '@/utils/request'
import {
  IChoiceItemType,
  IChoiceItemTypeListAxiosResponsePromise,
  IDRFRequestListParameters
} from '@/api/types'
import {
  IDynamicField,
  IDynamicFieldAxoisResponsePromise,
  IDynamicFieldList,
  IDynamicFieldListAxiosResponsePromise,
  IDynamicFieldSystemTag,
  IDynamicFieldSystemTagListAxiosResponsePromise,
} from './types'

// IDynamicField
export const getFields = (params?: IDRFRequestListParameters): IDynamicFieldListAxiosResponsePromise =>
  request.get<IDynamicFieldList>('/dynamicfields/', { params })

export const getField = (id: number): IDynamicFieldAxoisResponsePromise =>
  request.get<IDynamicField>(`/dynamicfields/${id}/`)

export const addField = (info: object): IDynamicFieldAxoisResponsePromise =>
  request.post<IDynamicField>('/dynamicfields/', info)

export const delField = (id: number) =>
  request.delete(`/dynamicfields/${id}/`)

export const patchField = (id: number, info: object): IDynamicFieldAxoisResponsePromise =>
  request.patch<IDynamicField>(`/dynamicfields/${id}/`, info)

export const getFieldTypeChoices = (): IChoiceItemTypeListAxiosResponsePromise =>
  request.get<IChoiceItemType[]>('/dynamicfields/get_type_choices/')

export const getFieldSystemTags = (): IDynamicFieldSystemTagListAxiosResponsePromise =>
  request.get<IDynamicFieldSystemTag[]>('/dynamicfields/get_system_tags/')
