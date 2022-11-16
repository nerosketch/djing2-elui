<template lang="pug">
tabs(
  :tabs="tabItems"
  activeTabName="services"
)
  template(#services)
    service-list
  template(#periodicpays)
    periodic-pay-list
  template(#shots)
    shot-list

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Tabs, { ICustomTabItem } from '@/components/tabs/tabs.vue'
import ServiceList from './services-list.vue'
import ShotList from './shot-list.vue'
import PeriodicPayList from './periodicpay-list.vue'

@Component({
  name: 'ServicesIndex',
  components: {
    ServiceList,
    ShotList,
    Tabs,
    PeriodicPayList
  }
})
export default class extends Vue {
  private tabItems: ICustomTabItem[] = [
    { name: 'services', title: this.$t('tariffs') },
    { name: 'periodicpays', title: this.$t('recurrentPayments') },
    { name: 'shots', title: this.$t('singlePayments') }
  ]
}
</script>
