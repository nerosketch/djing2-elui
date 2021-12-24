/* eslint-disable camelcase */
import { VuexModule, Module, Mutation, getModule } from 'vuex-module-decorators'
import { IPassportInfo } from '@/api/customers/types'
import store from '@/store'

@Module({ dynamic: true, store, name: 'passport' })
class PassportInfo extends VuexModule implements IPassportInfo {
  id = 0
  series = ''
  number = ''
  distributor = ''
  date_of_acceptance = ''
  division_code = ''
  registration_address = 0
  registration_address_title = ''

  @Mutation
  public SET_ALL_PASSPORT(data: IPassportInfo) {
    this.id = data.id
    this.series = data.series
    this.number = data.number
    this.distributor = data.distributor
    this.date_of_acceptance = data.date_of_acceptance
    this.division_code = data.division_code
    this.registration_address = data.registration_address
    this.registration_address_title = data.registration_address_title
  }

  @Mutation
  public RESET_ALL_PASSPORT() {
    this.id = 0
    this.series = ''
    this.number = ''
    this.distributor = ''
    this.date_of_acceptance = ''
    this.division_code = ''
    this.registration_address = 0
    this.registration_address_title = ''
  }
}
export const PassportInfoModule = getModule(PassportInfo)
