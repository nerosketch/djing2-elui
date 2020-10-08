import { IDRFListResponse, IDRFAxiosResponsePromise } from '@/api/types'

export enum IMessengerBotType {
  UNDEFINED = 0,
  VIBER = 1,
  TELEGRAM = 2
}

export interface IBaseMessenger {
  id: number
  title: string
  description: string
  bot_type: IMessengerBotType
  bot_type_name: string
  slug: string
  token: string
  avatar: string
}
export type IBaseMessengerList = IDRFListResponse<IBaseMessenger>
export type IBaseMessengerAxoisResponsePromise = IDRFAxiosResponsePromise<IBaseMessenger>
export type IBaseMessengerListAxiosResponsePromise = IDRFAxiosResponsePromise<IBaseMessengerList>

export interface IViberMessenger extends IBaseMessenger {
  
}
export type IViberMessengerList = IDRFListResponse<IViberMessenger>
export type IViberMessengerAxoisResponsePromise = IDRFAxiosResponsePromise<IViberMessenger>
export type IViberMessengerListAxiosResponsePromise = IDRFAxiosResponsePromise<IViberMessengerList>

export interface IViberMessage {
  msg: string
  date: string
  sender: string
  messenger: number
  subscriber: number
}
export type IViberMessageList = IDRFListResponse<IViberMessage>
export type IViberMessageAxoisResponsePromise = IDRFAxiosResponsePromise<IViberMessage>
export type IViberMessageListAxiosResponsePromise = IDRFAxiosResponsePromise<IViberMessageList>

export interface IViberSubscriber {
  uid: string
  name: string
  avatar: string
  account: number
}
export type IViberSubscriberList = IDRFListResponse<IViberSubscriber>
export type IViberSubscriberAxoisResponsePromise = IDRFAxiosResponsePromise<IViberSubscriber>
export type IViberSubscriberListAxiosResponsePromise = IDRFAxiosResponsePromise<IViberSubscriberList>

export interface ITelegramMessenger extends IBaseMessenger {
}
export type ITelegramMessengerList = IDRFListResponse<ITelegramMessenger>
export type ITelegramMessengerAxoisResponsePromise = IDRFAxiosResponsePromise<ITelegramMessenger>
export type ITelegramMessengerListAxiosResponsePromise = IDRFAxiosResponsePromise<ITelegramMessengerList>

export interface ITelegramSubscriber {
  chat_id: string
  name: string
  account: number
  account_name: string
}
