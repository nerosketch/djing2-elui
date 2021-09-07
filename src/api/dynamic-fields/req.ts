import request from '@/utils/request'
import {
  IDRFRequestListParameters,
} from '@/api/types'
import {
  IDynamicField,
  IDynamicFieldAxoisResponsePromise,
  IDynamicFieldList,
  IDynamicFieldListAxiosResponsePromise
} from './types'

// IDynamicField
export const getFields = (params: IDRFRequestListParameters): IDynamicFieldListAxiosResponsePromise =>
  request.get<IDynamicFieldList>('/dynamicfields/', { params })

export const getField = (id: number): IDynamicFieldAxoisResponsePromise =>
  request.get<IDynamicField>(`/dynamicfields/${id}/`)

export const addField = (info: object): IDynamicFieldAxoisResponsePromise =>
  request.post<IDynamicField>('/dynamicfields/', info)

export const delField = (id: number) =>
  request.delete(`/dynamicfields/${id}/`)

export const patchField = (id: number, info: object): IDynamicFieldAxoisResponsePromise =>
  request.patch<IDynamicField>(`/dynamicfields/${id}/`, info)
