import request from '@/utils/request'
import {
  IMapDot,
  IMapDotAxoisResponsePromise,
  IMapDotDevice,
  IMapDotDeviceListAxiosResponsePromise,
  IMapDotListAxiosResponsePromise
} from "./types"


export const loadMapDots = (): IMapDotListAxiosResponsePromise =>
  request.get<IMapDot[]>('/maps/')

export const addMapDot = (d: object): IMapDotAxoisResponsePromise =>
  request.post<IMapDot>('/maps/', d)

export const delMapDot = (dotId: number) =>
  request.delete(`/maps/${dotId}/`)

export const loadDotDevs = (dotId: number): IMapDotDeviceListAxiosResponsePromise =>
  request.get<IMapDotDevice[]>(`/maps/${dotId}/get_devs/`, {
    params: {
      fields: 'pk,comment,ip_address,mac_addr,status,is_noticeable'
    }
  })
