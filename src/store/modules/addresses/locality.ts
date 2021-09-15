import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { ILocalityModel } from '@/api/addresses/types'
import { addLocality, changeLocality, delLocality, getLocality } from '@/api/addresses/req'

@Module({ dynamic: true, store, name: 'locality' })
class Locality extends VuexModule implements ILocalityModel {
  public id = 0
  public title = ''

  @Mutation
  private RESET_ALL_LOCALITY() {
    this.id = 0
    this.title = ''
  }

  @Mutation
  private SET_ALL_LOCALITY(locality: ILocalityModel) {
    this.id = locality.id
    this.title = locality.title
  }

  @Mutation
  public SET_PK(id: number) {
    this.id = id
  }

  @Action
  public async GetLocality(id: number) {
    const r = await getLocality(id)
    this.SET_ALL_LOCALITY(r.data)
    return r
  }

  @Action
  public async AddLocality(newData: object) {
    const { data } = await addLocality(newData)
    this.SET_ALL_LOCALITY(data)
    return data
  }

  @Action
  public async PatchLocality(newData: object) {
    const r = await changeLocality(this.id, newData)
    this.SET_ALL_LOCALITY(r.data)
    return r
  }

  @Action
  public async DelLocality(id: number) {
    await delLocality(id)
    this.RESET_ALL_LOCALITY()
  }
}

export const LocalityModule = getModule(Locality)
