import { VuexModule, Module, Action, Mutation, MutationAction, getModule } from 'vuex-module-decorators'
import { ICustomer, IPassportInfo } from '@/api/customers/types'
import {
  getCustomer, addCustomer,
  getCustomerFormInitial,
  changeCustomer, delCustomer,
  pickService, makeShot,
  stopService, addBalance
} from '@/api/customers/req'
import store from '@/store'

@Module({ dynamic: true, store, name: 'passport' })
class PassportInfo extends VuexModule<IPassportInfo> implements IPassportInfo {
  id = 0
  series = ''
  number = ''
  distributor = ''
  date_of_acceptance = ''

  @Mutation
  public SET_ALL(data: IPassportInfo) {
    this.id = data.id
    this.series = data.series
    this.number = data.number
    this.distributor = data.distributor
    this.date_of_acceptance = data.date_of_acceptance
  }

  @Mutation
  public RESET_ALL() {
    this.id = 0
    this.series = ''
    this.number = ''
    this.distributor = ''
    this.date_of_acceptance = ''
  }
}
