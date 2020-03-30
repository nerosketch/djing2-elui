import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { getCustomers, getCustomer } from '@/api/customers'
import store from '@/store'

export interface ICustomerState {
  balance: number
  description: string
  street: string
  house: string
  device: string
  devPort: number
  autoRenewalService: boolean
  service: string
}

@Module({ dynamic: true, store, name: 'street' })
class Customer extends VuexModule implements ICustomerState {
  public balance = 0.0
  public description = ''
  public street = ''
  public house = ''
  public device = ''
  public devPort = 0
  public autoRenewalService = false
  public service = ''

  @Mutation
  private SET_BALANCE(balance: number) {
    this.balance = balance
  }

  @Mutation
  private SET_DESCRIPTION(descr: string) {
    this.description = descr
  }

  @Mutation
  private SET_STREET(street: string) {
    this.street = street
  }

  @Mutation
  private SET_HOUSE(house: string) {
    this.house = house
  }

  @Mutation
  private SET_DEVICE(dev: string) {
    this.device = dev
  }

  @Mutation
  private SET_PORT_NUM(num: number) {
    this.devPort = num
  }

  @Mutation
  private SET_AUTORENEWAL_SERVICE(ars: boolean) {
    this.autoRenewalService = ars
  }

  @Mutation
  private SET_SERVICE(srv: string) {
    this.service = srv
  }

  @Action
  public async GetAllCustomers() {
    const { data } = await getCustomers()
    if (!data) {
      throw Error('Verification failed, please Login again.')
    }
    return data.results
  }

  @Action
  public async GetCustomer(customerId: number) {
    const { data } = await getCustomer(customerId)
    if (!data) {
      throw Error('Verification failed, please Login again.')
    }
    this.SET_BALANCE(data.balance)
    this.SET_DESCRIPTION(data.description)
    this.SET_STREET(data.street_name)
    this.SET_HOUSE(data.house)
    this.SET_DEVICE(data.device_comment)
    this.SET_PORT_NUM(data.dev_port)
    this.SET_AUTORENEWAL_SERVICE(data.auto_renewal_service)
    this.SET_SERVICE(data.service_title)
    return data
  }
}

export const CustomerModule = getModule(Customer)
