<template lang="pug">
  .app-container
    span
      | {{ $t('customers.balance') }}:
  
    small
      | {{ $store.state.customerlegal.balance }}.
  
    span
      | {{ $t('createDate') }}:
  
    small
      | {{ $store.state.customerlegal.create_date }}
  
    el-tabs.border-card(v-model="activeTabName")
      el-tab-pane(:label="$t('customers.info')", name="info")
        el-row(:gutter="5")
          el-col.col_vert_space(:sm="24" :md="12")
            el-card(shadow="never")
              template(v-slot:header)
                | {{ $t('customersLegal.changeInfo') }}
            
              legal-form(v-if="ready")
        
          el-col.col_vert_space(:sm="24" :md="12")
            el-card(shadow="never")
              template(v-slot:header)
                | {{ $t('customersLegal.bank.requisites') }}
            
              legal-bank-info(v-if="ready", :uid="uid")
    
      el-tab-pane(
        :label="$t('customersLegal.branches')"
        name="branches"
        lazy)
        legal-branches(:customerId="uid")
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import LegalForm from '@/views/customers_legal/legal-form.vue'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import LegalBankInfo from './legal-bank-info.vue'
import { CustomerLegalModule } from '@/store/modules/customers_legal/customer-legal'
import LegalBranches from './branches/list.vue'
import TabMixin from '@/utils/tab-mixin'

@Component({
  name: 'LegalDetails',
  components: {
    LegalForm,
    LegalBankInfo,
    LegalBranches
  }
})
export default class extends mixins(TabMixin) {
  @Prop({ required: true }) private uid!: number

  private ready = false
  protected activeTabName = 'info'

  private async loadLegalCustomer(uid: number) {
    this.ready = false
    try {
      await CustomerLegalModule.getCustomerLegal(uid)
      this.ready = true
    } catch (err) {
      this.ready = false
    }
  }

  created() {
    if (this.uid) {
      this.loadLegalCustomer(this.uid)
    }

    this.setCrumbs()
  }

  @Watch('uid')
  private onChUid(uid: number) {
    this.loadLegalCustomer(uid)
  }

  @Watch('$store.state.customerlegal.title')
  private onChLegalTitle() {
    this.setCrumbs()
  }

  // Breadcrumbs
  private async setCrumbs() {
    await BreadcrumbsModule.SetCrumbs([
      {
        path: '/legal/',
        meta: {
          hidden: true,
          title: this.$t('route.organizations')
        }
      },
      {
        path: '',
        meta: {
          hidden: true,
          title: this.$store.state.customerlegal.title || '-'
        }
      }
    ] as any)
  }
  // End Breadcrumbs

}
</script>
