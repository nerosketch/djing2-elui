<template lang="pug">
  .tab-container
    el-tabs(
      v-model="activeName"
      type="border-card"
    )
      el-tab-pane(
        label='Гостевые сессии'
        name='sessions'
        lazy
      )
        keep-alive
          session-list
      el-tab-pane(
        label='Подсети'
        name='pools'
        lazy
      )
        keep-alive
          pool-list
      el-tab-pane(
        label='Вланы'
        name='vlans'
        lazy
      )
        keep-alive
          vlan-list
      el-tab-pane(
        label='Аренды ip'
        name='leases'
        lazy
      )
        keep-alive
          lease-list
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
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
export default class extends Vue {
  private activeName = 'sessions'

  @Watch('activeName')
  private onActiveNameChange(value: string) {
    const newPath = `${this.$route.path}?tab=${value}`
    if (newPath !== this.$route.fullPath) {
      this.$router.push(newPath)
    }
  }

  created() {
    // Init the default selected tab
    const tab = this.$route.query.tab as string
    if (tab) {
      this.activeName = tab
    }
  }
}
</script>
