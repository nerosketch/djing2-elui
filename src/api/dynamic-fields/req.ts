import request from '@/utils/request'
import {
  IChoiceItemType,
  IChoiceItemTypeListAxiosResponsePromise,
} from '@/api/types'
import {
  IDynamicField,
  IDynamicFieldSystemTag,
  IDynamicFieldSystemTagListAxiosResponsePromise,
} from './types'
import {
  addObjectDecorator,
  delObjectDecorator,
  getObjectDecorator,
  getObjectListDecorator,
  patchObjectDecorator
} from '@/api/baseRequests'


// IDynamicField
const dynamicFieldsUrl = '/dynamicfields/'
export const getFields = getObjectListDecorator<IDynamicField>(dynamicFieldsUrl)
export const getField = getObjectDecorator<IDynamicField>(dynamicFieldsUrl)
export const addField = addObjectDecorator<IDynamicField>(dynamicFieldsUrl)
export const delField = delObjectDecorator<IDynamicField>(dynamicFieldsUrl)
export const patchField = patchObjectDecorator<IDynamicField>(dynamicFieldsUrl)

export const getFieldTypeChoices = (): IChoiceItemTypeListAxiosResponsePromise =>
  request.get<IChoiceItemType[]>('/dynamicfields/get_type_choices/')

export const getFieldSystemTags = (): IDynamicFieldSystemTagListAxiosResponsePromise =>
  request.get<IDynamicFieldSystemTag[]>('/dynamicfields/get_system_tags/')
