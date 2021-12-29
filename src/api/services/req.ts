import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import {
  IObjectGroupPermsResultStruct,
  IObjectGroupPermsInitialAxiosResponsePromise,
  IObjectGroupPermsInitial
} from '@/api/types'
import {
  IService, IServiceList,
  IServiceListAxiosResponsePromise,
  IPeriodicPay,
  IOneShotPay,
  IDRFRequestListParametersService
} from './types'
import {
  addObjectDecorator,
  delObjectDecorator,
  getObjectDecorator,
  getObjectListDecorator,
  patchObjectDecorator
} from '@/api/baseRequests'


const baseSrvUrl = '/services/'

// IService
export const getServices = (params?: IDRFRequestListParametersService): IServiceListAxiosResponsePromise =>
  request.get<IServiceList>(baseSrvUrl, { params })

export const getService = getObjectDecorator<IService>(baseSrvUrl)
export const addService = addObjectDecorator<IService>(baseSrvUrl)
export const changeService = patchObjectDecorator<IService>(baseSrvUrl)
export const delService = delObjectDecorator<IService>(baseSrvUrl)

export const setServiceObjectsPerms = (id: number, dat: IObjectGroupPermsResultStruct) =>
  request.put(`${baseSrvUrl}${id}/set_object_perms/`, dat)

export const getServiceObjectsPerms = (id: number): IObjectGroupPermsInitialAxiosResponsePromise =>
  request.get<IObjectGroupPermsInitial>(`${baseSrvUrl}${id}/get_object_perms/`)

export const getServiceOSelectedObjectPerms = (id: number, profileGroupId: number): AxiosPromise<number[]> =>
  request.get(`${baseSrvUrl}${id}/get_selected_object_perms/${profileGroupId}/`)

// IPeriodicPay
const basePPUrl = '/services/periodic/'
export const getPeriodicPays = getObjectListDecorator<IPeriodicPay>(basePPUrl)
export const getPeriodicPay = getObjectDecorator<IPeriodicPay>(basePPUrl)
export const addPeriodicPay = addObjectDecorator<IPeriodicPay>(basePPUrl)
export const changePeriodicPay = patchObjectDecorator<IPeriodicPay>(basePPUrl)
export const delPeriodicPay = delObjectDecorator<IPeriodicPay>(basePPUrl)

// IOneShotPay
const baseOSPUrl = '/services/shot/'
export const getOneShotPays = getObjectListDecorator<IOneShotPay>(baseOSPUrl)
export const getOneShotPay = getObjectDecorator<IOneShotPay>(baseOSPUrl)
export const addOneShotPay = addObjectDecorator<IOneShotPay>(baseOSPUrl)
export const changeOneShotPay = patchObjectDecorator<IOneShotPay>(baseOSPUrl)
export const delOneShotPay = delObjectDecorator<IOneShotPay>(baseOSPUrl)
