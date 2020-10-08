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
  IMessengerMessageList,
  IMessengerMessageListAxiosResponsePromise,
  IMessengerMessage,
  IMessengerMessageAxoisResponsePromise
} from '@/api/messenger/types'
import { IDRFRequestListParameters } from '@/api/types'

export const getMessengers = (params?: IDRFRequestListParameters): IMessengerListAxiosResponsePromise =>
  request.get<IMessengerList>('/messenger/', { params })

export const getMessenger = (mId: number): IMessengerAxoisResponsePromise =>
  request.get<IMessenger>(`/messenger/${mId}/`)

export const addMessenger = (newDat: object): IMessengerAxoisResponsePromise =>
  request.post<IMessenger>('/messenger/', newDat)

export const patchMessenger = (mId: number, newDat: object): IMessengerAxoisResponsePromise =>
  request.patch<IMessenger>(`/messenger/${mId}/`, newDat)

export const deleteMessenger = (mId: number) =>
  request.delete(`/messenger/${mId}/`)

export const messengerSendWebHook = (mId: number) =>
  request.get(`/messenger/${mId}/send_webhook/`)

export const messengerStopWebHook = (mId: number) =>
  request.get(`/messenger/${mId}/stop_webhook/`)

export const getMessengerMessages = (params?: IDRFRequestListParameters): IMessengerMessageListAxiosResponsePromise =>
  request.get<IMessengerMessageList>('/messenger/msg/', { params })

export const getMessengerMessage = (mId: number): IMessengerMessageAxoisResponsePromise =>
  request.get<IMessengerMessage>(`/messenger/msg/${mId}/`)

export const addMessengerMessage = (newDat: object): IMessengerMessageAxoisResponsePromise =>
  request.post<IMessengerMessage>('/messenger/msg/', newDat)

export const patchMessengerMessage = (mId: number, newDat: object): IMessengerMessageAxoisResponsePromise =>
  request.patch<IMessengerMessage>(`/messenger/msg/${mId}/`, newDat)

export const deleteMessengerMessage = (mId: number) =>
  request.delete(`/messenger/msg/${mId}/`)

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
