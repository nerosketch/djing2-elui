<template lang="pug">
.app-container
  session-list(:uid="uid")
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import { RouteRecord } from 'vue-router'
import { CustomerModule } from '@/store/modules/customers/customer'

import SessionList from '@/views/networks/components/session-list.vue'

@Component({
  name: 'AuthorizedSessionList',
  components: {
    SessionList
  }
})
export default class extends Vue {
  @Prop({ required: true }) private uid!: number
  @Prop({ default: null }) private gid?: number
  @Prop({ default: null }) private grpName?: string
  @Prop({ default: null }) private customerName?: string

  private mgid = 0
  private mgrpName = ''
  private mCusName = ''

  created() {
    this.setCrumbs()
    this.loadCrumbsIfNotPassed()
  }

  private async loadCrumbsIfNotPassed() {
    if (!this.gid || !this.customerName || !this.grpName) {
      const customer = await CustomerModule.GetCustomer(this.uid)
      this.mgid = customer.group
      this.mgrpName = customer.group_title!
      this.mCusName = customer.full_name!
    } else {
      this.mgid = this.gid!
      this.mgrpName = this.grpName!
      this.mCusName = this.customerName!
    }
    this.setCrumbs()
  }

  private setCrumbs() {
    BreadcrumbsModule.SetCrumbs([
      {
        path: '/customers/',
        meta: {
          hidden: true,
          title: 'Группы абонентов'
        }
      },
      {
        path: { name: 'customersList', params: { groupId: this.mgid } },
        meta: {
          hidden: true,
          title: this.mgrpName
        }
      },
      {
        path: { name: 'customerDetails', params: { uid: this.uid } },
        meta: {
          hidden: true,
          title: this.mCusName || '-'
        }
      },
      {
        path: '',
        meta: {
          hidden: true,
          title: 'Сессии авторизации'
        }
      }
    ] as RouteRecord[])
  }
}
</script>
