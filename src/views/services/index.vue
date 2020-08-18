<template lang="pug">
  .tab-container
    el-tabs(
      v-model="activeName"
      type="border-card"
    )
      el-tab-pane(
        label='Тарифы'
        name='services'
        lazy
      )
        keep-alive
          service-list
      el-tab-pane(
        label='Периодические платежи'
        name='periodicpays'
        lazy
      )
        keep-alive
          periodic-pay-list
      el-tab-pane(
        label='Единоразовые платежи'
        name='shots'
        lazy
      )
        keep-alive
          shot-list
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import ServiceList from './services-list.vue'
import ShotList from './shot-list.vue'
import PeriodicPayList from './periodicpay-list.vue'

@Component({
  name: 'ServicesIndex',
  components: {
    ServiceList,
    ShotList,
    PeriodicPayList
  }
})
export default class extends Vue {
  private activeName = 'services'

  @Watch('activeName')
  private onActiveNameChange(value: string) {
    let allurl = `${this.$route.path}?tab=${value}`
    if (this.$route.fullPath !== allurl) {
      this.$router.push(allurl)
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
