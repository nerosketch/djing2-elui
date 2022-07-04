<template lang="pug">
  .tab-container
    el-tabs(v-model="activeTabName" type="border-card")
      el-tab-pane(
        :label="$t('guestSessions')"
        name="sessions"
        lazy)
        keep-alive
          lease-list

      el-tab-pane(
        :label="$t('subnets')"
        name="pools"
        lazy)
        keep-alive
          pool-list

      el-tab-pane(
        :label="$t('devices.vlanS')"
        name="vlans"
        lazy)
        keep-alive
          vlan-list
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import TabMixin from '@/utils/tab-mixin'
import VlanList from './components/vlanlist.vue'
import PoolList from './components/poollist.vue'
import LeaseList from './components/lease-list.vue'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'

@Component({
  name: 'NetworksIndex',
  components: {
    VlanList,
    PoolList,
    LeaseList,
  }
})
export default class extends mixins(TabMixin) {
  protected activeTabName = 'sessions'

  // Breadcrumbs
  private async buildBreadcrumb() {
    await BreadcrumbsModule.SetCrumbs([
      {
        path: '',
        meta: {
          hidden: true,
          title: this.$tc('route.network')
        }
      }
    ] as any)
  }
  // End Breadcrumbs

  created() {
    this.buildBreadcrumb()
  }
}
</script>
