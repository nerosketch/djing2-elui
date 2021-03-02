/* eslint-disable camelcase */
import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import {
  ICustomer, IBalanceAmountRequest,
  IPeriodicPayForIdRequest
} from '@/api/customers/types'
import {
  getCustomer, addCustomer,
  getCustomerFormInitial,
  changeCustomer, delCustomer,
  pickService, makeShot,
  stopService, addBalance,
  getCurrentService,
  setServiceGroupAccessory,
  makePeriodicPay4Customer
} from '@/api/customers/req'
import store from '@/store'

@Module({ dynamic: true, store, name: 'customer' })
class Customer extends VuexModule implements ICustomer {
  pk = 0
  username = ''
  telephone = ''
  fio = ''
  birth_day = ''
  create_date = ''
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
  last_connected_service_title = ''
  current_service = 0
  current_service__service__title = ''
  service_id = 0
  is_dynamic_ip = false
  full_name = ''
  raw_password = ''
  lease_count = 0
  sites: number[] = []
  traf_octs = 0

  @Mutation
  public SET_ID_CUSTOMER(id: number) {
    this.pk = id
  }

  @Mutation
  public SET_ALL_CUSTOMER(data: ICustomer) {
    this.pk = data.pk
    this.username = data.username
    this.telephone = data.telephone
    this.fio = data.fio
    this.birth_day = data.birth_day
    this.create_date = data.create_date
    this.group = data.group
    this.group_title = data.group_title!
    this.balance = data.balance
    this.description = data.description
    this.street = data.street
    this.street_name = data.street_name!
    this.house = data.house
    this.is_active = data.is_active
    this.gateway = data.gateway
    this.gateway_title = data.gateway_title!
    this.auto_renewal_service = data.auto_renewal_service
    this.device = data.device!
    this.device_comment = data.device_comment!
    this.dev_port = data.dev_port!
    this.last_connected_service = data.last_connected_service!
    this.last_connected_service_title = data.last_connected_service_title
    this.current_service = data.current_service!
    this.current_service__service__title = data.current_service__service__title!
    this.service_id = data.service_id!
    this.is_dynamic_ip = data.is_dynamic_ip
    this.full_name = data.full_name!
    this.raw_password = data.raw_password!
    this.lease_count = data.lease_count
    this.traf_octs = data.traf_octs!
    this.sites = data.sites
    return this
  }

  @Mutation
  public RESET_ALL_CUSTOMER() {
    this.pk = 0
    this.username = ''
    this.telephone = ''
    this.fio = ''
    this.birth_day = ''
    this.create_date = ''
    this.group = 0
    this.group_title = ''
    this.balance = 0.0
    this.description = ''
    delete this.street
    this.street_name = ''
    this.house = ''
    this.is_active = false
    this.gateway = 0
    this.gateway_title = ''
    this.auto_renewal_service = false
    this.device = 0
    this.device_comment = ''
    this.dev_port = 0
    this.last_connected_service = 0!
    this.last_connected_service_title = ''
    this.current_service = 0!
    this.current_service__service__title = ''!
    this.service_id = 0
    this.is_dynamic_ip = false
    this.full_name = ''
    this.raw_password = ''
    this.lease_count = 0
    this.sites = []
    this.traf_octs = 0
    return this
  }

  @Action
  public async InitDefaults() {
    const { data } = await getCustomerFormInitial()
    this.SET_ALL_CUSTOMER(data)
    return data
  }

  @Action
  public async GetCustomer(id: number) {
    const { data } = await getCustomer(id)
    if (!data) {
      throw Error('Verification failed, please Login again.')
    }
    this.SET_ALL_CUSTOMER(data)
    return data
  }

  @Action
  public async UpdateCustomer() {
    await this.GetCustomer(this.pk)
  }

  @Action
  public async AddCustomer(newData: object) {
    const { data } = await addCustomer(newData)
    this.SET_ALL_CUSTOMER(data)
    return data
  }

  @Action
  public async PatchCustomer(newData: object) {
    const { data } = await changeCustomer(this.pk, newData)
    this.SET_ALL_CUSTOMER(data)
    return data
  }

  @Action
  public async DelCustomer(id?: number) {
    if (id) {
      await delCustomer(id)
    } else {
      await delCustomer(this.pk)
    }
    this.RESET_ALL_CUSTOMER()
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
  public async AddBalance(qry: IBalanceAmountRequest) {
    await addBalance(this.pk, qry)
  }

  @Action
  public async GetCurrentServiceDetails() {
    const { data } = await getCurrentService(this.pk)
    return data
  }

  @Action
  public async ClearDevice() {
    const r = await changeCustomer(this.pk, {
      device: null,
      dev_port: null
    })
    this.SET_ALL_CUSTOMER(r.data)
    return r
  }

  @Action
  public async SetServiceGroupAccessory(services: number[]) {
    await setServiceGroupAccessory(this.pk, this.group, services)
  }

  @Action
  public MakePeriodicPay(req: IPeriodicPayForIdRequest) {
    return makePeriodicPay4Customer(this.pk, req)
  }
}

export const CustomerModule = getModule(Customer)
