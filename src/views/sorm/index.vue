<template lang="pug">
tabs(
  :tabs="tabItems"
  activeTabName="passport"
)
  template(#passport)
    customer-without-passport-list
  template(#contract)
    customer-without-contract-list
  template(#tooold)
    customer-too-old-list

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CustomerWithoutPassportList from './customer-without-passport-list.vue'
import CustomerWithoutContractList from './customer-without-contract-list.vue'
import CustomerTooOldList from './customer-too-old.vue'
import Tabs, { ICustomTabItem } from '@/components/tabs/tabs.vue'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'

@Component({
  name: 'SormIndex',
  components: {
    CustomerWithoutPassportList,
    CustomerWithoutContractList,
    CustomerTooOldList,
    Tabs
  }
})
export default class extends Vue {
  private tabItems: ICustomTabItem[] = [
    { name: 'passport', title: this.$t('sorm.withoutPassports') },
    { name: 'contract', title: this.$t('sorm.withoutContracts') },
    { name: 'tooold', title: this.$t('sorm.tooOld') }
  ]

  // Breadcrumbs
  created() {
    BreadcrumbsModule.SetCrumbs([
      {
        path: '/',
        meta: {
          hidden: true,
          title: this.$tc('route.sorm')
        }
      }
    ] as any)
  }
  // End Breadcrumbs
}
</script>
