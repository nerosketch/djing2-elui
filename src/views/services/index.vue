<template lang="pug">
  .tab-container
    el-tabs(
      v-model="activeTabName"
      type="border-card"
    )
      el-tab-pane(
        :label="$t('tariffs')"
        name="services"
        lazy
      )
        keep-alive
          service-list
    
      el-tab-pane(
        :label="$t('recurrentPayments')"
        name="periodicpays"
        lazy
      )
        keep-alive
          periodic-pay-list
    
      el-tab-pane(
        :label="$t('singlePayments')"
        name="shots"
        lazy
      )
        keep-alive
          shot-list
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import TabMixin from '@/utils/tab-mixin'
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
export default class extends mixins(TabMixin) {
  protected activeTabName = 'services'
}
</script>
