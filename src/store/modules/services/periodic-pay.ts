import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import {
  getPeriodicPay, addPeriodicPay,
  changePeriodicPay, delPeriodicPay
} from '@/api/services/req'
import { IPeriodicPay } from '@/api/services/types'


@Module({ dynamic: true, store, name: 'periodicpay' })
class PeriodicPay extends VuexModule implements IPeriodicPay {
  pk = 0
  name = ''
  when_add = ''
  amount = 0

  @Mutation
  public SET_ALL(data: IPeriodicPay) {
    this.pk = data.pk
    this.name = data.name
    this.when_add = data.when_add!
    this.amount = data.amount
  }

  @Mutation
  public RESET_ALL() {
    this.pk = 0
    this.name = ''
    this.when_add = ''
    this.amount = 0
    return this
  }

  @Action
  public async GetPeriodicPay(id: number) {
    const r = await getPeriodicPay(id)
    this.SET_ALL(r.data)
    return r
  }

  @Action
  public async AddPeriodicPay(data: IPeriodicPay) {
    await addPeriodicPay(data)
  }

  @Action
  public async SavePeriodicPay() {
    const r = await changePeriodicPay(this.pk, <IPeriodicPay> {
      name: this.name,
      when_add: this.when_add,
      amount: this.amount
    })
    this.SET_ALL(r.data)
    return r
  }

  @Action
  public async DelPeriodicPay(id: number) {
    await delPeriodicPay(id)
    this.RESET_ALL()
  }
}
export const PeriodicPayModule = getModule(PeriodicPay)
