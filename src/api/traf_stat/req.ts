import request from '@/utils/request'
import { ITrafArchiveItem, ITrafArchiveItemAxoisResponsePromise } from './types'

// ITrafArchiveItem
export const getTrafArchive = (customer_id: number, start_time: number, end_time: number): ITrafArchiveItemAxoisResponsePromise =>
  request.get<ITrafArchiveItem[]>('/traf_stat/archive/get_chart_data/', { params: {
    customer_id,
    start_time,
    end_time
  }})
