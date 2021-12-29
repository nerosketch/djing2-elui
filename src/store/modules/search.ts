import { VuexModule, Module, MutationAction, getModule } from 'vuex-module-decorators'
import { SearchResult, doSearch } from '@/api/search'
import store from '@/store'
import { ICustomer } from '@/api/customers/types'
import { IDevice } from '@/api/devices/types'

@Module({ dynamic: true, store, name: 'search' })
class Search extends VuexModule implements SearchResult {
  public accounts: ICustomer[] = []
  public devices: IDevice[] = []
  public searchStr = ''

  @MutationAction({ mutate: ['accounts', 'devices', 'searchStr'] })
  public async DoSearch(s?: string) {
    if (s) {
      const { data } = await doSearch(s)
      return Object.assign({ searchStr: s }, data)
    }
    return {
      accounts: [],
      devices: [],
      searchStr: s || ''
    }
  }
}

export const SearchModule = getModule(Search)
