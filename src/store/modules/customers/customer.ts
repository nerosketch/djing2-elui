import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { ICustomer } from '@/api/customers/types'
import {
  getCustomer, addCustomer,
  getCustomerFormInitial,
  changeCustomer, delCustomer,
  pickService, makeShot,
  stopService, addBalance
} from '@/api/customers/req'
import store from '@/store'

@Module({ dynamic: true, store, name: 'customer' })
class Customer extends VuexModule implements ICustomer {
  pk = 0
  username = ''
  telephone = ''
  fio = ''
  group = 0
  group_title = ''
  balance = 0.0
  description = ''
  street = 0
  street_name = ''
  house = ''
  is_active = false
  gateway = 0
  gateway_title = ''
  auto_renewal_service = false
  device = 0
  device_comment = ''
  dev_port = 0
  last_connected_service = 0
  current_service = 0
  service_title = ''
  is_dynamic_ip = false
  full_name = ''
  raw_password = ''

  @Mutation
  public SET_ALL(data: ICustomer) {
    this.pk = data.pk
    this.username = data.username
    this.telephone = data.telephone
    this.fio = data.fio
    this.group = data.group
    this.group_title = data.group_title
    this.balance = data.balance
    this.description = data.description
    this.street = data.street
    this.street_name = data.street_name
    this.house = data.house
    this.is_active = data.is_active
    this.gateway = data.gateway
    this.gateway_title = data.gateway_title
    this.auto_renewal_service = data.auto_renewal_service
    this.device = data.device!
    this.device_comment = data.device_comment
    this.dev_port = data.dev_port!
    this.last_connected_service = data.last_connected_service!
    this.current_service = data.current_service!
    this.service_title = data.service_title!
    this.is_dynamic_ip = data.is_dynamic_ip
    this.full_name = data.full_name
    this.raw_password = data.raw_password
    return this
  }

  @Mutation
  public RESET_ALL() {
    this.pk = 0
    this.username = ''
    this.telephone = ''
    this.fio = ''
    this.group = 0
    this.group_title = ''
    this.balance = 0.0
    this.description = ''
    this.street = 0
    this.street_name = ''
    this.house = ''
    this.is_active = false
    this.gateway = 0
    this.gateway_title = ''
    this.auto_renewal_service = false
    this.device = 0
    this.device_comment = ''
    this.dev_port = 0!
    this.last_connected_service = 0!
    this.current_service = 0!
    this.service_title = ''!
    this.is_dynamic_ip = false
    this.full_name = ''
    this.raw_password = ''
    return this
  }

  @Mutation
  public async INIT_DEFAULTS() {
    const { data } = await getCustomerFormInitial()
    this.SET_ALL(data)
  }

  @Action
  public async GetCustomer(id: number) {
    const { data } = await getCustomer(id)
    if (!data) {
      throw Error('Verification failed, please Login again.')
    }
    this.SET_ALL(data)
  }

  @Action
  public async AddCustomer(data: ICustomer) {
    await addCustomer(data)
    this.SET_ALL(data)
  }

  @Action
  public async SaveCustomer() {
    const r = await changeCustomer(this.pk, <ICustomer>{
      username: this.username,
      telephone: this.telephone,
      fio: this.fio,
      group: this.group,
      balance: this.balance,
      street: this.street,
      house: this.house,
      is_active: this.is_active,
      gateway: this.gateway,
      auto_renewal_service: this.auto_renewal_service,
      device: this.device,
      dev_port: this.dev_port,
      is_dynamic_ip: this.is_dynamic_ip,
      raw_password: this.raw_password,
      description: this.description
    })
    this.SET_ALL(r.data)
    return r
  }

  @Action
  public async DelCustomer(id: number) {
    await delCustomer(id)
    this.RESET_ALL()
  }

  @Action
  public async PickService(serviceId: number, deadline?: string) {
    await pickService(this.pk, serviceId, deadline)
  }

  @Action
  public async MakeShot(shotId: number) {
    await makeShot(this.pk, shotId)
  }

  @Action
  public async StopService() {
    await stopService(this.pk)
  }

  @Action
  public async AddBalance(cost: number, comment?: string) {
    await addBalance(this.pk, cost, comment)
  }

  @Action
  public async ClearDevice() {
    const r = await changeCustomer(this.pk, <ICustomer>{
      device: null,
      dev_port: null
    })
    this.SET_ALL(r.data)
    return r
  }
}

export const CustomerModule = getModule(Customer)
