import request from '@/utils/request'
import {
  IMapDot,
  IMapDotListAxiosResponsePromise
} from "./types"


export const loadMapDots = (): IMapDotListAxiosResponsePromise =>
  request.get<IMapDot[]>('/maps/')
