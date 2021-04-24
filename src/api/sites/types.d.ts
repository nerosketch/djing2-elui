import { IDRFAxiosResponsePromise, IDRFListResponse } from '@/api/types'

export interface ISite {
  id: number
  domain: string
  name: string
}
export type ISiteList = IDRFListResponse<ISite>
export type ISiteAxoisResponsePromise = IDRFAxiosResponsePromise<ISite>
export type ISiteListAxiosResponsePromise = IDRFAxiosResponsePromise<ISiteList>
