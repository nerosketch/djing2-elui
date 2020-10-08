import request from '@/utils/request'
import {
  IBaseMessengerListAxiosResponsePromise,
  IBaseMessengerList,
  IBaseMessengerAxoisResponsePromise,
  IBaseMessenger,
  IViberMessengerListAxiosResponsePromise,
  IViberMessengerList,
  IViberMessengerAxoisResponsePromise,
  IViberMessenger,
  ITelegramMessengerListAxiosResponsePromise,
  ITelegramMessengerList,
  ITelegramMessengerAxoisResponsePromise,
  ITelegramMessenger,
  IViberMessageListAxiosResponsePromise,
  IViberMessageList,
  IViberMessage,
  IViberMessageAxoisResponsePromise,
  IViberSubscriberListAxiosResponsePromise,
  IViberSubscriberList,
  IViberSubscriberAxoisResponsePromise,
  IViberSubscriber
} from '@/api/messenger/types'
import { IDRFRequestListParameters } from '@/api/types'

export const getMessengers = (params?: IDRFRequestListParameters): IBaseMessengerListAxiosResponsePromise =>
  request.get<IBaseMessengerList>('/messenger/', { params })

export const getMessenger = (mId: number): IBaseMessengerAxoisResponsePromise =>
  request.get<IBaseMessenger>(`/messenger/${mId}/`)

export const addMessenger = (newDat: object): IBaseMessengerAxoisResponsePromise =>
  request.post<IBaseMessenger>('/messenger/', newDat)

export const patchMessenger = (mId: number, newDat: object): IBaseMessengerAxoisResponsePromise =>
  request.patch<IBaseMessenger>(`/messenger/${mId}/`, newDat)

export const deleteMessenger = (mId: number) =>
  request.delete(`/messenger/${mId}/`)

export const getViberMessengers = (params?: IDRFRequestListParameters): IViberMessengerListAxiosResponsePromise =>
  request.get<IViberMessengerList>('/messenger/viber/', { params })

export const getViberMessenger = (mId: number): IViberMessengerAxoisResponsePromise =>
  request.get<IViberMessenger>(`'/messenger/viber/${mId}/`)

export const addViberMessenger = (newDat: object): IViberMessengerAxoisResponsePromise =>
  request.post<IViberMessenger>('/messenger/viber/', newDat)

export const patchViberMessenger = (mId: number, newDat: object): IViberMessengerAxoisResponsePromise =>
  request.patch<IViberMessenger>(`'/messenger/viber/${mId}/`, newDat)

export const deleteViberMessenger = (mId: number) =>
  request.delete(`'/messenger/viber/${mId}/`)

export const viberSendWebHook = (mId: number) =>
  request.delete(`'/messenger/viber/${mId}/send_webhook/`)

export const getViberMessages = (params?: IDRFRequestListParameters): IViberMessageListAxiosResponsePromise =>
  request.get<IViberMessageList>('/messenger/viber/msg/', { params })

export const getViberMessage = (mId: number): IViberMessageAxoisResponsePromise =>
  request.get<IViberMessage>(`'/messenger/viber/msg/${mId}/`)

export const addViberMessage = (newDat: object): IViberMessageAxoisResponsePromise =>
  request.post<IViberMessage>('/messenger/viber/msg/', newDat)

export const patchViberMessage = (mId: number, newDat: object): IViberMessageAxoisResponsePromise =>
  request.patch<IViberMessage>(`'/messenger/viber/msg/${mId}/`, newDat)

export const deleteViberMessage = (mId: number) =>
  request.delete(`'/messenger/viber/msg/${mId}/`)

export const getViberSubscribers = (params?: IDRFRequestListParameters): IViberSubscriberListAxiosResponsePromise =>
  request.get<IViberSubscriberList>('/messenger/viber/subscriber/', { params })

export const getViberSubscriber = (mId: number): IViberSubscriberAxoisResponsePromise =>
  request.get<IViberSubscriber>(`'/messenger/viber/subscriber/${mId}/`)

export const addViberSubscriber = (newDat: object): IViberSubscriberAxoisResponsePromise =>
  request.post<IViberSubscriber>('/messenger/viber/subscriber/', newDat)

export const patchViberSubscriber = (mId: number, newDat: object): IViberSubscriberAxoisResponsePromise =>
  request.patch<IViberSubscriber>(`'/messenger/viber/subscriber/${mId}/`, newDat)

export const deleteViberSubscriber = (mId: number) =>
  request.delete(`'/messenger/viber/subscriber/${mId}/`)

export const getTelegramMessengers = (params?: IDRFRequestListParameters): ITelegramMessengerListAxiosResponsePromise =>
  request.get<ITelegramMessengerList>('/messenger/telegram/', { params })

export const getTelegramMessenger = (mId: number): ITelegramMessengerAxoisResponsePromise =>
  request.get<ITelegramMessenger>(`'/messenger/telegram/${mId}/`)

export const addTelegramMessenger = (newDat: object): ITelegramMessengerAxoisResponsePromise =>
  request.post<ITelegramMessenger>('/messenger/telegram/', newDat)

export const patchTelegramMessenger = (mId: number, newDat: object): ITelegramMessengerAxoisResponsePromise =>
  request.patch<ITelegramMessenger>(`'/messenger/telegram/${mId}/`, newDat)

export const deleteTelegramMessenger = (mId: number) =>
  request.delete(`'/messenger/telegram/${mId}/`)

export const telegramSendWebHook = (mId: number) =>
  request.delete(`'/messenger/telegram/${mId}/send_webhook/`)
