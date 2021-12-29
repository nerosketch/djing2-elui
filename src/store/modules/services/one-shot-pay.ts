import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import {
  getOneShotPay, addOneShotPay,
  changeOneShotPay, delOneShotPay
} from '@/api/services/req'
import { IOneShotPay } from '@/api/services/types'

@Module({ dynamic: true, store, name: 'oneshotpay' })
class OneShotPay extends VuexModule implements IOneShotPay {
  public id = 0
  public name = ''
  public cost = 0.0
  public sites?: number[] = []

  @Mutation
  public SET_ALL_OSPAY(data: IOneShotPay) {
    this.id = data.id
    this.name = data.name
    this.cost = data.cost
    this.sites = data.sites || []
  }

  @Mutation
  public RESET_ALL_OSPAY() {
    this.id = 0
    this.name = ''
    this.cost = 0.0
    this.sites = []
    return this
  }

  @Action
  public async GetOneShotPay(id: number) {
    const r = await getOneShotPay(id)
    this.SET_ALL_OSPAY(r.data)
    return r
  }

  @Action
  public async AddOneShotPay(newInfo: object) {
    const { data } = await addOneShotPay(newInfo)
    return data
  }

  @Action
  public async PatchOneShotPay(newOSPay: object) {
    const r = await changeOneShotPay(this.id, newOSPay)
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
