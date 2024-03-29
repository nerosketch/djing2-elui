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
