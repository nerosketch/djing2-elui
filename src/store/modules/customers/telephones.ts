/* eslint-disable camelcase */
import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { IAdditionalTelephone } from '@/api/customers/types'
import {
  getTelephone, addTelephone,
  changeTelephone, delTelephone
} from '@/api/customers/req'

@Module({ dynamic: true, store, name: 'telephone' })
class AdditionalTelephone extends VuexModule implements IAdditionalTelephone {
  id = 0
  telephone = ''
  owner_name = ''
  customer = 0
  create_time = ''

  @Mutation
  public RESET_ALL_TEL() {
    this.id = 0
    this.telephone = ''
    this.owner_name = ''
    this.customer = 0
  }

  @Mutation
  private SET_ALL_TEL(tel: IAdditionalTelephone) {
    this.id = tel.id
    this.telephone = tel.telephone
    this.owner_name = tel.owner_name
    this.customer = tel.customer
  }

  @Action
  public async GetTelephone(id: number) {
    const r = await getTelephone(id)
    this.SET_ALL_TEL(r.data)
    return r
  }

  @Action
  public async AddTelephone(tel: object) {
    const { data } = await addTelephone(tel)
    this.SET_ALL_TEL(data)
    return data
  }

  @Action
  public async PatchTelephone(tel: object) {
    const { data } = await changeTelephone(this.id, tel)
    this.SET_ALL_TEL(data)
    return data
  }

  @Action
  public async DelTelephone(id: number) {
    await delTelephone(id)
    this.RESET_ALL_TEL()
  }
}

export const AdditionalTelephoneModule = getModule(AdditionalTelephone)
