import request from '@/utils/request'
import {
  IGateway,
  IGatewayClassChoiceTypeList,
  IGatewayClassChoiceType
} from './types'
import {
  addObjectDecorator,
  delObjectDecorator,
  getObjectDecorator,
  getObjectListDecorator,
  patchObjectDecorator
} from '@/api/baseRequests'

const gwUrl = '/gateways/'
export const getGateways = getObjectListDecorator<IGateway>(gwUrl)
export const getGateway = getObjectDecorator<IGateway>(gwUrl)
export const addGateway = addObjectDecorator<IGateway>(gwUrl)
export const changeGateway = patchObjectDecorator<IGateway>(gwUrl)
export const delGateway = delObjectDecorator<IGateway>(gwUrl)

export const getGwClassChoices = (): IGatewayClassChoiceTypeList =>
  request.get<IGatewayClassChoiceType[]>('/gateways/gateway_class_choices/')
