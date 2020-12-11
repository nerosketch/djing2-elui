import { IDRFAxiosResponsePromise, IDRFListResponse } from '@/api/types'

export interface IUserSession {
  customer: number
  assign_time: string
  last_event_time: string
  radius_username: string
  framed_ip_addr: string
  session_id: string
  session_duration: string
  h_input_octets: string
  h_output_octets: string
  h_input_packets: string
  h_output_packets: string
  closed: boolean
}
export type IUserSessionList = IDRFListResponse<IUserSession>
export type IUserSessionAxoisResponsePromise = IDRFAxiosResponsePromise<IUserSession>
export type IUserSessionListAxiosResponsePromise = IDRFAxiosResponsePromise<IUserSessionList>

