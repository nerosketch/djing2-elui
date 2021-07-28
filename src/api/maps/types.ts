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

export interface IMapDotDevice {
  pk: number
  ip_address: string
  mac_addr: string
  comment: string
  status: number
  is_noticeable: boolean
}
export type IMapDotDeviceAxoisResponsePromise = IDRFAxiosResponsePromise<IMapDotDevice>
export type IMapDotDeviceListAxiosResponsePromise = IDRFAxiosResponsePromise<IMapDotDevice[]>
