<template lang="pug">
  tabs(
    :tabs="tabItems"
    activeTabName="sessions"
  )
    template(#sessions)
      lease-list
    template(#pools)
      pool-list
    template(#vlans)
      vlan-list

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import VlanList from './components/vlanlist.vue'
import PoolList from './components/poollist.vue'
import LeaseList from './components/lease-list.vue'
import Tabs, { ICustomTabItem } from '@/components/tabs/tabs.vue'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'

@Component({
  name: 'NetworksIndex',
  components: {
    VlanList,
    PoolList,
    LeaseList,
    Tabs
  }
})
export default class extends Vue {
  private tabItems: ICustomTabItem[] = [
    { name: 'sessions', title: this.$t('guestSessions') },
    { name: 'pools', title: this.$t('subnets') },
    { name: 'vlans', title: this.$t('devices.vlanS') }
  ]

  // Breadcrumbs
  private buildBreadcrumb() {
    BreadcrumbsModule.SetCrumbs([
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
