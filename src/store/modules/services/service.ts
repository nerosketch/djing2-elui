/* eslint-disable camelcase */
import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import {
  getService, addService,
  changeService, delService
} from '@/api/services/req'
import {
  IServiceTypeEnum, IService
} from '@/api/services/types'

@Module({ dynamic: true, store, name: 'service' })
class Service extends VuexModule implements IService {
  id = 0
  title = ''
  descr = ''
  speed_in = 0.0
  speed_out = 0.0
  speed_burst = 1.0
  cost = 0.0
  calc_type = IServiceTypeEnum.BASE
  is_admin = false
  usercount = 0
  planned_deadline = ''
  calc_type_name = ''
  sites?: number[] = []

  @Mutation
  public SET_ALL_SERVICE(data: IService) {
    this.id = data.id
    this.title = data.title
    this.descr = data.descr
    this.speed_in = data.speed_in
    this.speed_out = data.speed_out
    this.speed_burst = data.speed_burst
    this.cost = data.cost
    this.calc_type = data.calc_type
    this.is_admin = data.is_admin
    this.usercount = data.usercount
    this.planned_deadline = data.planned_deadline
    this.calc_type_name = data.calc_type_name
    this.sites = data.sites || []
  }

  @Mutation
  public RESET_ALL_SERVICE() {
    this.id = 0
    this.title = ''
    this.descr = ''
    this.speed_in = 0.0
    this.speed_out = 0.0
    this.speed_burst = 1.0
    this.cost = 0.0
    this.calc_type = IServiceTypeEnum.BASE
    this.is_admin = false
    this.usercount = 0
    this.planned_deadline = ''
    this.calc_type_name = ''
    this.sites = []
    return this
  }

  @Action
  public async GetService(id: number) {
    const r = await getService(id)
    this.SET_ALL_SERVICE(r.data)
    return r
  }

  @Action
  public async AddService(data: object) {
    await addService(data)
  }

  @Action
  public async PatchService(newSrv: object) {
    const r = await changeService(this.id, newSrv)
    this.SET_ALL_SERVICE(r.data)
    return r
  }

  @Action
  public async DelService(id: number) {
    await delService(id)
    this.RESET_ALL_SERVICE()
  }
}
export const ServiceModule = getModule(Service)
