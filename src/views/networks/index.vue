<template lang="pug">
  .tab-container
    el-tabs(v-model="activeTabName", type="border-card")
      el-tab-pane(
        :label="$t('gostevye-sessii')"
        name="sessions"
        lazy)
        keep-alive
          session-list
    
      el-tab-pane(
        :label="$t('podseti')"
        name="pools"
        lazy)
        keep-alive
          pool-list
    
      el-tab-pane(
        :label="$t('vlany')"
        name="vlans"
        lazy)
        keep-alive
          vlan-list
    
      el-tab-pane(
        :label="$t('arendy-ip')"
        name="leases"
        lazy)
        keep-alive
          lease-list
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import TabMixin from '@/utils/tab-mixin'
import VlanList from './components/vlanlist.vue'
import LeaseList from './components/leaselist.vue'
import PoolList from './components/poollist.vue'
import SessionList from './components/session-list.vue'

@Component({
  name: 'NetworksIndex',
  components: {
    VlanList,
    LeaseList,
    PoolList,
    SessionList
  }
})
export default class extends mixins(TabMixin) {
  protected activeTabName = 'sessions'
}
</script>
