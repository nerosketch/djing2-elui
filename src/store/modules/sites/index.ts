import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { addSite, getSite, changeSite } from '@/api/sites/req'
import { ISite } from '@/api/sites/types'
import store from '@/store'

@Module({ dynamic: true, store, name: 'sites' })
class Site extends VuexModule implements ISite {
  public id = 0
  public domain = ''
  public name = ''

  @Mutation
  public SET_ALL_SITE(data: ISite) {
    this.id = data.id
    this.name = data.name
    this.domain = data.domain
  }

  @Mutation
  public RESET_ALL_SITE() {
    this.id = 0
    this.domain = ''
    this.name = ''
  }

  @Action
  public async GetSite(siteId: number) {
    const { data } = await getSite(siteId)
    this.SET_ALL_SITE(data)
    return data
  }

  @Action
  public async AddSite(siteInfo: object) {
    const { data } = await addSite(siteInfo)
    this.SET_ALL_SITE(data)
    return data
  }

  @Action
  public async PatchSite(newData: object) {
    const { data } = await changeSite(this.id, newData)
    this.SET_ALL_SITE(data)
    return data
  }
}

export const SiteModule = getModule(Site)
