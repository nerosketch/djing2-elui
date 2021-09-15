import request from '@/utils/request'
import { IDRFRequestListParametersCustomer } from "../customers/types"
import {
  ILocalityModel,
  ILocalityModelAxoisResponsePromise,
  ILocalityModelList,
  ILocalityModelListAxiosResponsePromise,
  IStreetModel,
  IStreetModelAxoisResponsePromise,
  IStreetModelList,
  IStreetModelListAxiosResponsePromise
} from "./types"


// ILocalityModel
export const getLocalities = (params?: IDRFRequestListParametersCustomer): ILocalityModelListAxiosResponsePromise =>
  request.get<ILocalityModelList>('/addrs/', { params })

export const getLocality = (id: number): ILocalityModelAxoisResponsePromise =>
  request.get<ILocalityModel>(`/addrs/${id}/`)

export const addLocality = (info: object): ILocalityModelAxoisResponsePromise =>
  request.post<ILocalityModel>('/addrs/', info)

export const delLocality = (id: number) =>
  request.delete(`/addrs/${id}/`)

export const changeLocality = (id: number, info: object): ILocalityModelAxoisResponsePromise =>
  request.patch<ILocalityModel>(`/addrs/${id}/`, info)

// IStreetModel
export const getStreets = (params?: IDRFRequestListParametersCustomer): IStreetModelListAxiosResponsePromise =>
  request.get<IStreetModelList>('/addrs/street/', { params })

export const getStreet = (id: number): IStreetModelAxoisResponsePromise =>
  request.get<IStreetModel>(`/addrs/street/${id}/`)

export const addStreet = (info: object): IStreetModelAxoisResponsePromise =>
  request.post<IStreetModel>('/addrs/street/', info)

export const delStreet = (id: number) =>
  request.delete(`/addrs/street/${id}/`)

export const changeStreet = (id: number, info: object): IStreetModelAxoisResponsePromise =>
  request.patch<IStreetModel>(`/addrs/street/${id}/`, info)
