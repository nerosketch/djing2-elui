import { IDRFListResponse, IDRFAxiosResponsePromise } from '@/api/types'

export enum IMessengerBotType {
  UNDEFINED = 0,
  VIBER = 1,
  TELEGRAM = 2
}

export interface IMessenger {
  id: number
  title: string
  description: string
  bot_type: IMessengerBotType
  bot_type_name: string
  slug: string
  token: string
  avatar: string
}
export type IMessengerList = IDRFListResponse<IMessenger>
export type IMessengerAxoisResponsePromise = IDRFAxiosResponsePromise<IMessenger>
export type IMessengerListAxiosResponsePromise = IDRFAxiosResponsePromise<IMessengerList>

export interface IMessengerMessage {
  id: number
  msg: string
  date: string
  sender: string
  messenger: number
  subscriber: number
}
export type IMessengerMessageList = IDRFListResponse<IMessengerMessage>
export type IMessengerMessageAxoisResponsePromise = IDRFAxiosResponsePromise<IMessengerMessage>
export type IMessengerMessageListAxiosResponsePromise = IDRFAxiosResponsePromise<IMessengerMessageList>

export interface IMessengerSubscriber {
  id: number
  uid: string
  name: string
  avatar: string
  account: number
  account_name: string
}
export type IMessengerSubscriberList = IDRFListResponse<IMessengerSubscriber>
export type IMessengerSubscriberAxoisResponsePromise = IDRFAxiosResponsePromise<IMessengerSubscriber>
export type IMessengerSubscriberListAxiosResponsePromise = IDRFAxiosResponsePromise<IMessengerSubscriberList>
