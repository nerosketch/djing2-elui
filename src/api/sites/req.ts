import request from '@/utils/request'
import {
  ISite, ISiteList,
  ISiteAxoisResponsePromise,
  ISiteListAxiosResponsePromise
} from './types'
import { IDRFRequestListParameters } from '@/api/types'

export const getSites = (params?: IDRFRequestListParameters): ISiteListAxiosResponsePromise =>
  request.get<ISiteList>('/sites/', { params })

export const getSite = (siteId: number): ISiteAxoisResponsePromise =>
  request.get<ISite>(`/sites/${siteId}/`)

export const addSite = (newData: object): ISiteAxoisResponsePromise =>
  request.post<ISite>('/sites/', newData)

export const changeSite = (siteId: number, newData: object): ISiteAxoisResponsePromise =>
  request.patch<ISite>(`/sites/${siteId}/`, newData)
