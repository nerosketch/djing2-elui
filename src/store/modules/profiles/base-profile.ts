import { IBaseAccount } from "@/api/base_account";
import { VuexModule } from "vuex-module-decorators";

export class BaseProfileVuexModule extends VuexModule implements IBaseAccount {
  id = 0
  password = ''
  last_login = ''
  username = ''
  fio = ''
  birth_day = ''
  create_date = ''
  last_update_time = ''
  is_active = false
  is_admin = false
  is_superuser = false
  telephone = ''
  groups: number[] = []
  sites: number[] = []
}

export function SET_ALL_BASE_PROFILE(obj: IBaseAccount, profile: IBaseAccount) {
  obj.id = profile.id
  obj.password = profile.password
  obj.last_login = profile.last_login!
  obj.username = profile.username
  obj.fio = profile.fio
  obj.birth_day = profile.birth_day!
  obj.create_date = profile.create_date
  obj.last_update_time = profile.last_update_time!
  obj.is_active = profile.is_active
  obj.is_admin = profile.is_admin
  obj.is_superuser = profile.is_superuser!
  obj.telephone = profile.telephone
  obj.groups = profile.groups
  obj.sites = profile.sites!
}

export function RESET_ALL_BASE_PROFILE(obj: IBaseAccount) {
  obj.id = 0
  obj.password = ''
  obj.last_login = ''
  obj.username = ''
  obj.fio = ''
  obj.birth_day = ''
  obj.create_date = ''
  obj.last_update_time = ''
  obj.is_active = false
  obj.is_admin = false
  obj.is_superuser = false
  obj.telephone = ''
  obj.groups = []
  obj.sites = []
}
