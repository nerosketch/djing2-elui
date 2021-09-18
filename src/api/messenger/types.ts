import { IDRFListResponse, IDRFAxiosResponsePromise } from '@/api/types'
import { AxiosPromise } from 'axios'

export interface IMessenger {
  id: number
  title: string
  description: string
  bot_type: number
  bot_type_name: string
  token: string
  avatar: string
  global_link: string
  current_webhook: string
}
export type IMessengerList = IDRFListResponse<IMessenger>
export type IMessengerAxoisResponsePromise = IDRFAxiosResponsePromise<IMessenger>
export type IMessengerListAxiosResponsePromise = IDRFAxiosResponsePromise<IMessengerList>

export type IBotType = [number, string]
export type IBotTypesAxiosPromise = AxiosPromise<IBotType[]>

export interface IMessengerSubscriber {
  id: number
  name: string
  avatar: string
  account: number
  account_name: string
}
export type IMessengerSubscriberList = IDRFListResponse<IMessengerSubscriber>
export type IMessengerSubscriberAxoisResponsePromise = IDRFAxiosResponsePromise<IMessengerSubscriber>
export type IMessengerSubscriberListAxiosResponsePromise = IDRFAxiosResponsePromise<IMessengerSubscriberList>

export interface IOpt {
  key: string
  label: string
  value: boolean
}
export interface IMessengerOptions {
  notification_flags: IOpt[]
  various_options: IOpt[]
}
export type IMessengerOptionsAxoisResponsePromise = IDRFAxiosResponsePromise<IMessengerOptions>
