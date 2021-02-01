import request from '@/utils/request'

export const pushSendNotifications = (info: object): PromiseLike<Response> =>
  request.post('/webpush/save_information', info)
