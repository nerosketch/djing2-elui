import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { ICustomer } from '@/api/customers/types'
import { IDevice } from '@/api/devices/types'

export interface SearchResult {
  accounts: ICustomer[]
  devices: IDevice[]
}
export type SearchResultAxoisResponsePromise = AxiosPromise<SearchResult>


export const doSearch = (s: string): SearchResultAxoisResponsePromise =>
  request.get<SearchResult>('/search/', { params: { s } })
