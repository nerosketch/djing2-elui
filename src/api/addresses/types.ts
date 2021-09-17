/* eslint-disable camelcase */
import {
  IDRFAxiosResponsePromise,
  IDRFListResponse,
} from '@/api/types'

export interface ILocalityModel {
  id: number
  title: string
  sites: number[]
}
export type ILocalityModelList = IDRFListResponse<ILocalityModel>
export type ILocalityModelAxoisResponsePromise = IDRFAxiosResponsePromise<ILocalityModel>
export type ILocalityModelListAxiosResponsePromise = IDRFAxiosResponsePromise<ILocalityModelList>


// IStreetModel
export interface IStreetModel {
  id: number
  name: string
  locality: number
}
export type IStreetModelList = IDRFListResponse<IStreetModel>
export type IStreetModelAxoisResponsePromise = IDRFAxiosResponsePromise<IStreetModel>
export type IStreetModelListAxiosResponsePromise = IDRFAxiosResponsePromise<IStreetModelList>
