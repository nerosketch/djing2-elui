import request from '@/utils/request'
import {
  IGatewayList, IGatewayListAxiosResponsePromise,
  IGatewayAxoisResponsePromise,
  IGateway,
  IGatewayClassChoiceTypeList,
  IGatewayClassChoiceType
} from './types'
import { IDRFRequestListParameters } from '@/api/types'

const gwUrl = '/gateways/'

export const getGateways = (params?: IDRFRequestListParameters): IGatewayListAxiosResponsePromise =>
  request.get<IGatewayList>(gwUrl, { params })

export const getGateway = (gwId: number): IGatewayAxoisResponsePromise =>
  request.get<IGateway>(`${gwUrl}${gwId}/`)

export const addGateway = (newGateway: object): IGatewayAxoisResponsePromise =>
  request.post<IGateway>(gwUrl, newGateway)

export const changeGateway = (gwId: number, newData: object): IGatewayAxoisResponsePromise =>
  request.patch<IGateway>(`${gwUrl}${gwId}/`, newData)

export const delGateway = (gwId: number) =>
  request.delete(`${gwUrl}${gwId}/`)

export const getGwClassChoices = (): IGatewayClassChoiceTypeList =>
  request.get<IGatewayClassChoiceType[]>('/gateways/gateway_class_choices/')

// export const fetchCustomersSrvnetCredentialsbgw = (gwId: number) =>
//   request.get(`${gwUrl}fetch_customers_srvnet_credentials_by_gw/`, { params: {
//     gw_id: gwId
//   }})
