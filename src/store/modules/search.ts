import { VuexModule, Module, MutationAction, getModule } from 'vuex-module-decorators'
import { SearchResult, doSearch } from '@/api/search'
import store from '@/store'
import { ICustomer } from '@/api/customers/types'
import { IDevice } from '@/api/devices/types'

@Module({ dynamic: true, store, name: 'search' })
class Search extends VuexModule implements SearchResult {
  accounts: Array<ICustomer> = []
  devices: Array<IDevice> = []
  searchStr = ''

  @MutationAction({ mutate: ['accounts', 'devices'] })
  public async DoSearch(s?: string) {
    if (s && s !== this.searchStr) {
      this.searchStr = s
    }
    if (this.searchStr) {
      const { data } = await doSearch(this.searchStr)
      return data
    }
    return {
      accounts: [],
      devices: []
    }
  }
}

export const SearchModule = getModule(Search)
