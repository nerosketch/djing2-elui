import { IDRFAxiosResponsePromise } from '../types'

export interface ITrafArchiveItem {
  time: string
  octsum: number
  pctsum: number
}
export type ITrafArchiveItemAxoisResponsePromise = IDRFAxiosResponsePromise<ITrafArchiveItem[]>
