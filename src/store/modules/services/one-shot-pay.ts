import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import {
  getOneShotPay, addOneShotPay,
  changeOneShotPay, delOneShotPay
} from '@/api/services/req'
import { IOneShotPay } from '@/api/services/types'

@Module({ dynamic: true, store, name: 'OneShotPay' })
class OneShotPay extends VuexModule implements IOneShotPay {
  pk = 0
  name = ''
  cost = 0.0

  @Mutation
  public SET_ALL_OSPAY(data: IOneShotPay) {
    this.pk = data.pk
    this.name = data.name
    this.cost = data.cost
  }

  @Mutation
  public RESET_ALL_OSPAY() {
    this.pk = 0
    this.name = ''
    this.cost = 0.0
    return this
  }

  @Action
  public async GetOneShotPay(id: number) {
    const r = await getOneShotPay(id)
    this.SET_ALL_OSPAY(r.data)
    return r
  }

  @Action
  public async AddOneShotPay(data: IOneShotPay) {
    await addOneShotPay(data)
  }

  @Action
  public async PatchOneShotPay(newOSPay: object) {
    const r = await changeOneShotPay(this.pk, newOSPay)
    this.SET_ALL_OSPAY(r.data)
    return r
  }

  @Action
  public async DelOneShotPay(id: number) {
    await delOneShotPay(id)
    this.RESET_ALL_OSPAY()
  }
}
export const OneShotPayModule = getModule(OneShotPay)
