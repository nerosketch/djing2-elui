import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { IBreadcrumbs } from '@/api/breadcrumb-types'
import { RouteRecord } from 'vue-router'

@Module({ dynamic: true, store, name: 'breadcrumbmod' })
class Breadcrumbs extends VuexModule implements IBreadcrumbs {
  public breadcrumbs: RouteRecord[] = []

  @Mutation
  public SET_CRUMBS(brs: RouteRecord[]): void {
    this.breadcrumbs = brs
  }

  @Action
  public async SetCrumbs(brs: RouteRecord[]) {
    this.SET_CRUMBS(brs)
  }
}

export const BreadcrumbsModule = getModule(Breadcrumbs)
