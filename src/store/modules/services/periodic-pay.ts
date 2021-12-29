/* eslint-disable camelcase */
import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import {
  getPeriodicPay, addPeriodicPay,
  changePeriodicPay, delPeriodicPay
} from '@/api/services/req'
import { IPeriodicPay } from '@/api/services/types'

@Module({ dynamic: true, store, name: 'periodicpay' })
class PeriodicPay extends VuexModule implements IPeriodicPay {
  public id = 0
  public name = ''
  public when_add = ''
  public amount = 0
  public sites?: number[] = []

  @Mutation
  public SET_ALL_PPAY(data: IPeriodicPay) {
    this.id = data.id
    this.name = data.name
    this.when_add = data.when_add!
    this.amount = data.amount
    this.sites = data.sites || []
  }

  @Mutation
  public RESET_ALL_PPAY() {
    this.id = 0
    this.name = ''
    this.when_add = ''
    this.amount = 0
    this.sites = []
    return this
  }

  @Action
  public async GetPeriodicPay(id: number) {
    const r = await getPeriodicPay(id)
    this.SET_ALL_PPAY(r.data)
    return r
  }

  @Action
  public async AddPeriodicPay(newInfo: object) {
    const { data } = await addPeriodicPay(newInfo)
    return data
  }

  @Action
  public async PatchPeriodicPay(newPpay: object) {
    const r = await changePeriodicPay(this.id, newPpay)
    this.SET_ALL_PPAY(r.data)
    return r
  }

  @Action
  public async DelPeriodicPay(id: number) {
    await delPeriodicPay(id)
    this.RESET_ALL_PPAY()
  }
}
export const PeriodicPayModule = getModule(PeriodicPay)
