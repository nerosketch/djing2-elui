import request from '@/utils/request'
import { IDRFRequestListParameters } from '@/api/types'
import {
  IService, IServiceList,
  IServiceAxoisResponsePromise,
  IServiceListAxiosResponsePromise,
  IPeriodicPay, IPeriodicPayList,
  IPeriodicPayAxoisResponsePromise,
  IPeriodicPayListAxiosResponsePromise,
  IOneShotPay, IOneShotPayPayList,
  IOneShotPayPayAxoisResponsePromise,
  IOneShotPayPayListAxiosResponsePromise
} from './types'

const baseSrvUrl = '/services/'

// IService
export const getServices = (params?: IDRFRequestListParameters): IServiceListAxiosResponsePromise =>
  request.get<IServiceList>(baseSrvUrl, { params })

export const getService = (id: number): IServiceAxoisResponsePromise =>
  request.get<IService>(`${baseSrvUrl}${id}/`)

export const addService = (newSrv: IService): IServiceAxoisResponsePromise =>
  request.post<IService>(baseSrvUrl, newSrv)

export const changeService = (id: number, newData: IService): IServiceAxoisResponsePromise =>
  request.patch<IService>(`${baseSrvUrl}${id}/`, newData)

export const delService = (id: number) =>
  request.delete(`${baseSrvUrl}${id}/`)

// IPeriodicPay
const basePPUrl = '/services/periodic/'

export const getPeriodicPays = (params?: IDRFRequestListParameters): IPeriodicPayListAxiosResponsePromise =>
  request.get<IPeriodicPayList>(basePPUrl, { params })

export const getPeriodicPay = (id: number): IPeriodicPayAxoisResponsePromise =>
  request.get<IPeriodicPay>(`${basePPUrl}${id}/`)

export const addPeriodicPay = (newPP: IPeriodicPay): IPeriodicPayAxoisResponsePromise =>
  request.post<IPeriodicPay>(basePPUrl, newPP)

export const changePeriodicPay = (id: number, newPP: IPeriodicPay): IPeriodicPayAxoisResponsePromise =>
  request.patch<IPeriodicPay>(`${basePPUrl}${id}/`, newPP)

export const delPeriodicPay = (id: number) =>
  request.delete(`${basePPUrl}${id}/`)

// IOneShotPay
const baseOSPUrl = '/services/shot/'

export const getOneShotPays = (params?: IDRFRequestListParameters): IOneShotPayPayListAxiosResponsePromise =>
  request.get<IOneShotPayPayList>(baseOSPUrl, { params })

export const getOneShotPay = (id: number): IOneShotPayPayAxoisResponsePromise =>
  request.get<IOneShotPay>(`${baseOSPUrl}${id}/`)

export const addOneShotPay = (newSrv: IOneShotPay): IOneShotPayPayAxoisResponsePromise =>
  request.post<IOneShotPay>(baseOSPUrl, newSrv)

export const changeOneShotPay = (id: number, newData: IOneShotPay): IOneShotPayPayAxoisResponsePromise =>
  request.patch<IOneShotPay>(`${baseOSPUrl}${id}/`, newData)

export const delOneShotPay = (id: number) =>
  request.delete(`${baseOSPUrl}${id}/`)
