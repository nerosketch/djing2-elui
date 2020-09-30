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
  ordering?: string
  fields?: string
}

export interface IDRFAxiosResponse<T> extends AxiosResponse<T> {}
export interface IDRFAxiosResponsePromise<T> extends AxiosPromise<T> {}
export interface IDRFAxiosResponseListPromise<T> extends IDRFAxiosResponsePromise<IDRFListResponse<T>> {}

// Simple response
export interface ISimpleResponseResult {
  text: string
  status: number
}
export type ISimpleResponseResultAxiosResponsePromise = IDRFAxiosResponsePromise<ISimpleResponseResult>

// Report pie chart
export interface PieChartData {
  value: number
  name: string
}
export interface PieChartReport {
  labels: string[]
  data: PieChartData[]
}
