import request from '@/utils/request'
import {
  IMessengerListAxiosResponsePromise,
  IMessengerList,
  IMessengerAxoisResponsePromise,
  IMessenger,
  IMessengerSubscriberListAxiosResponsePromise,
  IMessengerSubscriberList,
  IMessengerSubscriberAxoisResponsePromise,
  IMessengerSubscriber,
  IBotTypesAxiosPromise,
  IBotType,
  IMessengerOptionsAxoisResponsePromise,
  IMessengerOptions,
} from '@/api/messenger/types'
import { IDRFRequestListParameters } from '@/api/types'

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

export const getMessengerSubscribers = (params?: IDRFRequestListParameters): IMessengerSubscriberListAxiosResponsePromise =>
  request.get<IMessengerSubscriberList>('/messenger/subscriber/', { params })

export const getMessengerSubscriber = (mId: number): IMessengerSubscriberAxoisResponsePromise =>
  request.get<IMessengerSubscriber>(`/messenger/subscriber/${mId}/`)

export const addMessengerSubscriber = (newDat: object): IMessengerSubscriberAxoisResponsePromise =>
  request.post<IMessengerSubscriber>('/messenger/subscriber/', newDat)

export const patchMessengerSubscriber = (mId: number, newDat: object): IMessengerSubscriberAxoisResponsePromise =>
  request.patch<IMessengerSubscriber>(`/messenger/subscriber/${mId}/`, newDat)

export const deleteMessengerSubscriber = (mId: number) =>
  request.delete(`/messenger/subscriber/${mId}/`)

export const getOptions = (): IMessengerOptionsAxoisResponsePromise =>
  request.get<IMessengerOptions>('/messenger/options/')

export const setOptions = (options: string[]): IMessengerOptionsAxoisResponsePromise =>
  request.put<IMessengerOptions>('/messenger/options/')
