import request from '@/utils/request'
import { ITrafArchiveItem, ITrafArchiveItemAxoisResponsePromise } from './types'

// ITrafArchiveItem
export const getTrafArchive = (customer_id: number, startTime: Date, endTime: Date): ITrafArchiveItemAxoisResponsePromise =>
  request.get<ITrafArchiveItem[]>('/traf_stat/archive/get_chart_data/', { params: {
    customer_id,
    start_time: startTime.getTime() / 1000,
    end_time: endTime.getTime() / 1000
  } })
