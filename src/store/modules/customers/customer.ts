/* eslint-disable camelcase */
import { Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import {
  ICustomer, IBalanceAmountRequest,
  IPeriodicPayForIdRequest,
  IBuyPayloadType
} from '@/api/customers/types'
import {
  getCustomer, addCustomer,
  getCustomerFormInitial,
  changeCustomer, delCustomer,
  pickService, makeShot,
  stopService, addBalance,
  getCurrentService,
  setServiceGroupAccessory,
  makePeriodicPay4Customer,
  setCustomerMarkers
} from '@/api/customers/req'
import store from '@/store'
import {
  BaseProfileVuexModule,
  RESET_ALL_BASE_PROFILE,
  SET_ALL_BASE_PROFILE
} from '@/store/modules/profiles/base-profile'

@Module({ dynamic: true, store, name: 'customer' })
class Customer extends BaseProfileVuexModule implements ICustomer {
  group_id = 0
  group_title = ''
  address_id = 0
  address_title = ''
  balance = 0.0
  description = ''
  gateway_id = 0
  gateway_title = ''
  auto_renewal_service = false
  device_id = 0
  device_comment = ''
  dev_port_id = 0
  last_connected_service_id = 0
  last_connected_service_title = ''
  current_service_id = 0
  current_service_title = ''
  service_id = 0
  is_dynamic_ip = false
  full_name = ''
  raw_password = ''
  lease_count = 0
  marker_icons: string[] = []

  @Mutation
  public SET_ID_CUSTOMER(id: number) {
    this.id = id
  }

  @Mutation
  public SET_ALL_CUSTOMER(data: ICustomer) {
    SET_ALL_BASE_PROFILE(this, data)
    this.group_id = data.group_id
    this.group_title = data.group_title!
    this.address_id = data.address_id
    this.address_title = data.address_title
    this.balance = data.balance
    this.description = data.description
    this.gateway_id = data.gateway_id
    this.gateway_title = data.gateway_title!
    this.auto_renewal_service = data.auto_renewal_service
    this.device_id = data.device_id!
    this.device_comment = data.device_comment!
    this.dev_port_id = data.dev_port_id!
    this.last_connected_service_id = data.last_connected_service_id!
    this.last_connected_service_title = data.last_connected_service_title
    this.current_service_id = data.current_service_id!
    this.current_service_title = data.current_service_title!
    this.service_id = data.service_id!
    this.is_dynamic_ip = data.is_dynamic_ip
    this.full_name = data.full_name!
    this.raw_password = data.raw_password!
    this.lease_count = data.lease_count
    this.marker_icons = data.marker_icons
    return this
  }

  @Mutation
  public RESET_ALL_CUSTOMER() {
    RESET_ALL_BASE_PROFILE(this)
    this.group_id = 0
    this.group_title = ''
    this.address_id = 0
    this.address_title = ''
    this.balance = 0.0
    this.description = ''
    this.gateway_id = 0
    this.gateway_title = ''
    this.auto_renewal_service = false
    this.device_id = 0
    this.device_comment = ''
    this.dev_port_id = 0
    this.last_connected_service_id = 0!
    this.last_connected_service_title = ''
    this.current_service_id = 0!
    this.current_service_title = ''!
    this.service_id = 0
    this.is_dynamic_ip = false
    this.full_name = ''
    this.raw_password = ''
    this.lease_count = 0
    this.marker_icons = []
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
  public UpdateCustomer() {
    return this.GetCustomer(this.id)
  }

  @Action
  public async AddCustomer(newData: object) {
    const { data } = await addCustomer(newData)
    this.SET_ALL_CUSTOMER(data)
    return data
  }

  @Action
  public async PatchCustomer(newData: object) {
    const { data } = await changeCustomer(this.id, newData)
    this.SET_ALL_CUSTOMER(data)
    return data
  }

  @Action
  public async DelCustomer(id?: number) {
    if (id) {
      await delCustomer(id)
    } else {
      await delCustomer(this.id)
    }
    this.RESET_ALL_CUSTOMER()
  }

  @Action
  public PickService(buyPayload: IBuyPayloadType) {
    return pickService(this.id, buyPayload)
  }

  @Action
  public MakeShot(shotId: number) {
    return makeShot(this.id, shotId)
  }

  @Action
  public StopService() {
    return stopService(this.id)
  }

  @Action
  public AddBalance(qry: IBalanceAmountRequest) {
    return addBalance(this.id, qry)
  }

  @Action
  public async GetCurrentServiceDetails() {
    const { data } = await getCurrentService(this.id)
    return data
  }

  @Action
  public async ClearDevice() {
    const r = await changeCustomer(this.id, {
      device: null,
      dev_port: null
    })
    this.SET_ALL_CUSTOMER(r.data)
    return r
  }

  @Action
  public SetServiceGroupAccessory(services: number[]) {
    return setServiceGroupAccessory(this.group_id, services)
  }

  @Action
  public MakePeriodicPay(req: IPeriodicPayForIdRequest) {
    return makePeriodicPay4Customer(this.id, req)
  }

  @Action
  public SetMarkers(markerNames?: string[]) {
    if (markerNames) {
      return setCustomerMarkers(this.id, markerNames)
    } else {
      return setCustomerMarkers(this.id, this.marker_icons)
    }
  }
}

export const CustomerModule = getModule(Customer)
