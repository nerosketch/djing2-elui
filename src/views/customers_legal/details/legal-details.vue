<template lang="pug">
tabs(:tabs="tabItems")
  template(#head)
    span {{ $t('customers.balance') }}:
    small {{ $store.state.customerlegal.balance }}.
    span {{ $t('createDate') }}:
    small {{ $store.state.customerlegal.create_date }}

  el-row(:gutter="5")
    el-col.col_vert_space(:sm="24" :md="12")
      el-card(shadow="never")
        template(#header)
          | {{ $t('customersLegal.changeInfo') }}

        legal-form(v-if="ready")

    el-col.col_vert_space(:sm="24" :md="12")
      el-card(shadow="never")
        template(#header)
          | {{ $t('customersLegal.bank.requisites') }}

        legal-bank-info(v-if="ready" :uid="uid")

  template(#branches)
    legal-branches(:customerId="uid")

</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import LegalForm from '@/views/customers_legal/legal-form.vue'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import LegalBankInfo from './legal-bank-info.vue'
import { CustomerLegalModule } from '@/store/modules/customers_legal/customer-legal'
import LegalBranches from './branches/list.vue'
import Tabs, { ICustomTabItem } from '@/components/tabs/tabs.vue'

@Component({
  name: 'LegalDetails',
  components: {
    LegalForm,
    LegalBankInfo,
    LegalBranches,
    Tabs
  }
})
export default class extends Vue {
  @Prop({ required: true }) private uid!: number

  private ready = false
  protected activeTabName = ''

  private async loadLegalCustomer(uid: number) {
    this.ready = false
    try {
      await CustomerLegalModule.getCustomerLegal(uid)
      this.ready = true
    } catch {
      this.ready = false
    }
  }

  private tabItems: ICustomTabItem[] = [
    { title: this.$t('customers.info') },
    { title: this.$t('customersLegal.branches'), name: 'branches' }
  ]

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
    BreadcrumbsModule.SetCrumbs([
      {
        path: '/legal/',
        meta: {
          hidden: true,
          title: this.$tc('route.organizations')
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
