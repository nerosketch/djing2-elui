import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface IStreet {
  name: string
}

@Module({ dynamic: true, store, name: 'street' })
class Street extends VuexModule implements IStreet {
  public name: string = ''

  @Mutation
  private SET_NAME(name: string) {
    this.name = name
  }

  @Action
  public async getStreets() {

  }
}

export const StreetModule = getModule(Street)
