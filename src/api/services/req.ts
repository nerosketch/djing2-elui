import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import {
  IDRFRequestListParameters,
  IObjectGroupPermsResultStruct,
  IObjectGroupPermsInitialAxiosResponsePromise,
  IObjectGroupPermsInitial
} from '@/api/types'
import {
  IService, IServiceList,
  IServiceAxoisResponsePromise,
  IServiceListAxiosResponsePromise,
  IPeriodicPay, IPeriodicPayList,
  IPeriodicPayAxoisResponsePromise,
  IPeriodicPayListAxiosResponsePromise,
  IOneShotPay, IOneShotPayPayList,
  IOneShotPayPayAxoisResponsePromise,
  IOneShotPayPayListAxiosResponsePromise,
  IDRFRequestListParametersService
} from './types'

const baseSrvUrl = '/services/'

// IService
export const getServices = (params?: IDRFRequestListParametersService): IServiceListAxiosResponsePromise =>
  request.get<IServiceList>(baseSrvUrl, { params })

export const getService = (id: number): IServiceAxoisResponsePromise =>
  request.get<IService>(`${baseSrvUrl}${id}/`)

export const addService = (newSrv: object): IServiceAxoisResponsePromise =>
  request.post<IService>(baseSrvUrl, newSrv)

export const changeService = (id: number, newData: object): IServiceAxoisResponsePromise =>
  request.patch<IService>(`${baseSrvUrl}${id}/`, newData)

export const delService = (id: number) =>
  request.delete(`${baseSrvUrl}${id}/`)

export const setServiceObjectsPerms = (id: number, dat: IObjectGroupPermsResultStruct) =>
  request.put(`${baseSrvUrl}${id}/set_object_perms/`, dat)

export const getServiceObjectsPerms = (id: number): IObjectGroupPermsInitialAxiosResponsePromise =>
  request.get<IObjectGroupPermsInitial>(`${baseSrvUrl}${id}/get_object_perms/`)

export const getServiceOSelectedObjectPerms = (id: number, profileGroupId: number): AxiosPromise<number[]> =>
  request.get(`${baseSrvUrl}${id}/get_selected_object_perms/${profileGroupId}/`)

// IPeriodicPay
const basePPUrl = '/services/periodic/'

export const getPeriodicPays = (params?: IDRFRequestListParameters): IPeriodicPayListAxiosResponsePromise =>
  request.get<IPeriodicPayList>(basePPUrl, { params })

export const getPeriodicPay = (id: number): IPeriodicPayAxoisResponsePromise =>
  request.get<IPeriodicPay>(`${basePPUrl}${id}/`)

export const addPeriodicPay = (newPP: object): IPeriodicPayAxoisResponsePromise =>
  request.post<IPeriodicPay>(basePPUrl, newPP)

export const changePeriodicPay = (id: number, newPP: object): IPeriodicPayAxoisResponsePromise =>
  request.patch<IPeriodicPay>(`${basePPUrl}${id}/`, newPP)

export const delPeriodicPay = (id: number) =>
  request.delete(`${basePPUrl}${id}/`)

// IOneShotPay
const baseOSPUrl = '/services/shot/'

export const getOneShotPays = (params?: IDRFRequestListParameters): IOneShotPayPayListAxiosResponsePromise =>
  request.get<IOneShotPayPayList>(baseOSPUrl, { params })

export const getOneShotPay = (id: number): IOneShotPayPayAxoisResponsePromise =>
  request.get<IOneShotPay>(`${baseOSPUrl}${id}/`)

export const addOneShotPay = (newSrv: object): IOneShotPayPayAxoisResponsePromise =>
  request.post<IOneShotPay>(baseOSPUrl, newSrv)

export const changeOneShotPay = (id: number, newData: object): IOneShotPayPayAxoisResponsePromise =>
  request.patch<IOneShotPay>(`${baseOSPUrl}${id}/`, newData)

export const delOneShotPay = (id: number) =>
  request.delete(`${baseOSPUrl}${id}/`)
