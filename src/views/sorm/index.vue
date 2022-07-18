<template lang="pug">
.tab-container
  el-tabs(v-model="activeTabName" type="border-card")
    el-tab-pane(
      :label="$t('sorm.withoutPassports')"
      name="passport"
    )
      customer-without-passport-list
    el-tab-pane(
      :label="$t('sorm.withoutContracts')"
      name="contract"
    )
      customer-without-contract-list
    el-tab-pane(
      :label="$t('sorm.tooOld')"
      name="tooold"
    )
      customer-too-old-list
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import CustomerWithoutPassportList from './customer-without-passport-list.vue'
import CustomerWithoutContractList from './customer-without-contract-list.vue'
import CustomerTooOldList from './customer-too-old.vue'
import tabMixin from '@/utils/tab-mixin'
import { mixins } from 'vue-class-component'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'

@Component({
  name: 'SormIndex',
  components: {
    CustomerWithoutPassportList,
    CustomerWithoutContractList,
    CustomerTooOldList,
  }
})
export default class extends mixins(tabMixin) {
  protected activeTabName = 'passport'

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
