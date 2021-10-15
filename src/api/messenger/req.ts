import request from '@/utils/request'
import {
  IMessengerListAxiosResponsePromise,
  IMessengerList,
  IMessengerAxoisResponsePromise,
  IMessenger,
  IMessengerSubscriber,
  IBotTypesAxiosPromise,
  IBotType
} from '@/api/messenger/types'
import { IDRFRequestListParameters } from '@/api/types'
import {
  addObjectDecorator,
  delObjectDecorator,
  getObjectDecorator,
  getObjectListDecorator,
  patchObjectDecorator
} from '@/api/baseRequests'


export const getMessengerTypes = (): IBotTypesAxiosPromise =>
  request.get<IBotType[]>('/messenger/get_bot_types/')

export const getMessengers = (typeName: string, params?: IDRFRequestListParameters): IMessengerListAxiosResponsePromise =>
  request.get<IMessengerList>(`/messenger/${typeName}`, { params })

export const getMessenger = (typeName: string, mId: number): IMessengerAxoisResponsePromise =>
  request.get<IMessenger>(`/messenger/${typeName}/${mId}/`)

export const addMessenger = (info: { m: object, typeName: string }): IMessengerAxoisResponsePromise =>
  request.post<IMessenger>(`/messenger/${info.typeName}/`, info.m)

export const patchMessenger = (typeName: string, mId: number, newDat: object): IMessengerAxoisResponsePromise =>
  request.patch<IMessenger>(`/messenger/${typeName}/${mId}/`, newDat)

export const deleteMessenger = (typeName: string, mId: number) =>
  request.delete(`/messenger/${typeName}/${mId}/`)

export const messengerSendWebHook = (typeName: string, mId: number) =>
  request.get(`/messenger/${typeName}/${mId}/send_webhook/`)

export const messengerStopWebHook = (typeName: string, mId: number) =>
  request.get(`/messenger/${typeName}/${mId}/stop_webhook/`)

// MessengerSubscriber CRUD
const messengerSubscriberUrl = '/messenger/subscriber/'
export const getMessengerSubscribers = getObjectListDecorator<IMessengerSubscriber>(messengerSubscriberUrl)
export const getMessengerSubscriber = getObjectDecorator<IMessengerSubscriber>(messengerSubscriberUrl)
export const addMessengerSubscriber = addObjectDecorator<IMessengerSubscriber>(messengerSubscriberUrl)
export const patchMessengerSubscriber = patchObjectDecorator<IMessengerSubscriber>(messengerSubscriberUrl)
export const deleteMessengerSubscriber = delObjectDecorator<IMessengerSubscriber>(messengerSubscriberUrl)
