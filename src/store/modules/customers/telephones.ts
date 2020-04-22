import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { IAdditionalTelephone } from '@/api/customers/types'
import {
  getTelephone, addTelephone,
  changeTelephone, delTelephone
} from '@/api/customers/req'

@Module({ dynamic: true, store, name: 'telephone' })
class AdditionalTelephone extends VuexModule implements IAdditionalTelephone {
  pk = 0
  telephone = ''
  owner_name = ''
  customer = 0

  @Mutation
  private RESET_ALL_TEL() {
    this.pk = 0
    this.telephone = ''
    this.owner_name = ''
    this.customer = 0
  }

  @Mutation
  private SET_ALL_TEL(Telephone: IAdditionalTelephone) {
    this.pk = Telephone.pk
    this.telephone = Telephone.telephone
    this.owner_name = Telephone.owner_name
    this.customer = Telephone.customer
  }

  @Action
  public async GetTelephone(id: number) {
    const r = await getTelephone(id)
    this.SET_ALL_TEL(r.data)
    return r
  }

  @Action
  public async AddTelephone(data: IAdditionalTelephone) {
    await addTelephone(data)
    this.SET_ALL_TEL(data)
  }

  @Action
  public async SaveTelephone() {
    const r = await changeTelephone(this.pk, <IAdditionalTelephone>{
      telephone: this.telephone,
      customer: this.customer
    })
    this.SET_ALL_TEL(r.data)
    return r
  }

  @Action
  public async DelTelephone(id: number) {
    await delTelephone(id)
    this.RESET_ALL_TEL()
  }
}

export const AdditionalTelephoneModule = getModule(AdditionalTelephone)
