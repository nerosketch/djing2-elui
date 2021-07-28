import request from '@/utils/request'
import {
  IMapDot,
  IMapDotAxoisResponsePromise,
  IMapDotListAxiosResponsePromise
} from "./types"


export const loadMapDots = (): IMapDotListAxiosResponsePromise =>
  request.get<IMapDot[]>('/maps/')

export const addMapDot = (d: object): IMapDotAxoisResponsePromise =>
  request.post<IMapDot>('/maps/', d)
