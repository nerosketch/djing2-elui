import { IBaseAccount } from "@/api/base_account";
import { Mutation, VuexModule } from "vuex-module-decorators";

class BaseProfileVuexModule extends VuexModule implements IBaseAccount {
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
  token = ''
  groups: number[] = []
  sites: number[] = []

  @Mutation
  protected SET_ALL_BASE_PROFILE(profile: IBaseAccount) {
    this.id = profile.id
    this.password = profile.password
    this.last_login = profile.last_login!
    this.username = profile.username
    this.fio = profile.fio
    this.birth_day = profile.birth_day!
    this.create_date = profile.create_date
    this.last_update_time = profile.last_update_time!
    this.is_active = profile.is_active
    this.is_admin = profile.is_admin
    this.is_superuser = profile.is_superuser!
    this.telephone = profile.telephone
    this.token = profile.token
    this.groups = profile.groups
    this.sites = profile.sites!
  }

  @Mutation
  protected RESET_ALL_BASE_PROFILE() {
    this.id = 0
    this.password = ''
    this.last_login = ''
    this.username = ''
    this.fio = ''
    this.birth_day = ''
    this.create_date = ''
    this.last_update_time = ''
    this.is_active = false
    this.is_admin = false
    this.is_superuser = false
    this.telephone = ''
    this.token = ''
    this.groups = []
    this.sites = []
  }
}

export default BaseProfileVuexModule
