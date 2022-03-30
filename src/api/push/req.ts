import request from '@/utils/request'
import { AxiosPromise } from 'axios'

export const pushSendNotifications = (info: object): AxiosPromise =>
  request.post('/webpush/save_information/', info)

export const getVapidPublicKey = (): AxiosPromise<string> =>
  request.get<string>('/get_vapid_public_key/')
