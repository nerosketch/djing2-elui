<template>
  <div class="tab-container">
    <el-tabs v-model="activeTabName" type="border-card">
      <el-tab-pane label="$t('gostevye-sessii')" name="sessions" lazy>
        <keep-alive>
          <session-list></session-list>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="$t('podseti')" name="pools" lazy>
        <keep-alive>
          <pool-list></pool-list>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="$t('vlany-0')" name="vlans" lazy>
        <keep-alive>
          <vlan-list></vlan-list>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="$t('arendy-ip')" name="leases" lazy>
        <keep-alive>
          <lease-list></lease-list>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
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
