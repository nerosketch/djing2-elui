import { AxiosResponse, AxiosPromise } from 'axios'

export interface IDRFListResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface IDRFRequestListParameters {
  page: number
  page_size: number
  ordering?: string | null
  fields?: string | null
}

export interface IDRFAxiosResponse<T> extends AxiosResponse<T> {}
export interface IDRFAxiosResponsePromise<T> extends AxiosPromise<T> {}
export interface IDRFAxiosResponseListPromise<T> extends IDRFAxiosResponsePromise<IDRFListResponse<T>> {}
