/* eslint-disable camelcase */

export interface IBaseAccount {
  id: number
  password: string
  last_login?: string
  username: string
  fio: string
  birth_day?: string
  create_date: string
  last_update_time?: string
  is_active: boolean
  is_admin: boolean
  is_superuser?: boolean
  telephone: string
  token: string
  groups: number[]
  sites?: number[]
}
