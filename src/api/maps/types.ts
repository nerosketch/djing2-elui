import { IDRFAxiosResponsePromise } from "@/api/types"

export interface IMapDot {
  id: number
  title: string
  latitude: number
  longitude: number
  attachment: string | null
  devices: number[]
}
export type IMapDotAxoisResponsePromise = IDRFAxiosResponsePromise<IMapDot>
export type IMapDotListAxiosResponsePromise = IDRFAxiosResponsePromise<IMapDot[]>
