<template>  
  <div class="app-container"><span>{{ $t('customers.balance') }}:</span><small>&nbsp; {{ $store.state.customerlegal.balance }}.</small><span> {{ $t('createDate') }}:</span><small>&nbsp; {{ $store.state.customerlegal.create_date }}</small>
    <el-tabs class="border-card" v-model="activeTabName">
      <el-tab-pane :label="$t('customers.info')" name="info">
        <el-row :gutter="5">
          <el-col class="col_vert_space" :sm="24" :md="12">
            <el-card shadow="never">
              <template v-slot:header>{{ $t('customersLegal.changeInfo') }}</template>
              <legal-form v-if="ready"></legal-form>
            </el-card>
          </el-col>
          <el-col class="col_vert_space" :sm="24" :md="12">
            <el-card shadow="never">
              <template v-slot:header>{{ $t('customersLegal.bank.requisites') }}</template>
              <legal-bank-info v-if="ready" :uid="uid"></legal-bank-info>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane :label="$t('customersLegal.branches')" name="branches" lazy>
        <legal-branches :customerId="uid"></legal-branches>
      </el-tab-pane>
    </el-tabs>
  </div>
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
