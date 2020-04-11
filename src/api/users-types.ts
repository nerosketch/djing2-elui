export interface IProfile {
  pk: number
  username: string
  fio: string
  is_active: boolean
  is_admin: boolean
  telephone?: string
  avatar: string | null
  email?: string
  full_name?: string
}
