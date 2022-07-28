<template lang="pug">
tabs(
  :tabs="tabItems"
  activeTabName="accreport"
)
  template(#accreport)
    fin-report
  template(#custoreport)
    h1 Отчёт по абонентам
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Tabs, { ICustomTabItem } from '@/components/tabs/tabs.vue'
import FinReport from './fin-report.vue'

@Component({
  name: 'FinGw',
  components: {
    Tabs,
    FinReport
  }
})
export default class extends Vue {
  private tabItems: ICustomTabItem[] = [
    { name: 'accreport', title: this.$t('fin.incomeReport') },
    { name: 'custoreport', title: this.$t('fin.customerIncome') },
  ]

}
</script>
