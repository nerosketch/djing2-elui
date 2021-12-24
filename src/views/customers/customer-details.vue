<template>
  <div class="app-container">
    <slot name="head"><span>{{ $t('customers.balance') }}:</span><small> {{ $store.state.customer.balance }}.</small><span> {{ $t('startDate') }}:</span><small> {{ $store.state.customer.create_date }}</small></slot>
    <el-tabs class="border-card" v-model="activeTabName">
      <el-tab-pane :label="$t('customers.info')" name="info" lazy>
        <slot name="info">
          <keep-alive>
            <info v-if="loaded"></info>
          </keep-alive>
        </slot>
      </el-tab-pane>
      <el-tab-pane :label="$t('route.services')" name="services" :disabled="!$perms.customers.view_customerservice" lazy>
        <slot name="services">
          <keep-alive>
            <services v-if="loaded"></services>
          </keep-alive>
        </slot>
      </el-tab-pane>
      <el-tab-pane :label="$t('route.finance')" name="fin" :disabled="!$perms.customers.view_customerlog" lazy>
        <slot name="fin">
          <keep-alive>
            <finance v-if="loaded"></finance>
          </keep-alive>
        </slot>
      </el-tab-pane>
      <el-tab-pane :label="$t('customers.taskHistory')" name="history" :disabled="!$perms.tasks.view_task" lazy>
        <slot name="history">
          <keep-alive>
            <customer-task-history v-if="loaded"></customer-task-history>
          </keep-alive>
        </slot>
      </el-tab-pane>
      <el-tab-pane :label="$t('customers.trafHistory')" name="traf" lazy>
        <slot name="traf">
          <keep-alive>
            <el-card v-if="loaded">
              <template #header>{{ $t('customers.trafHistory') }}</template>
              <traf-report :customerId="uid"></traf-report>
            </el-card>
          </keep-alive>
        </slot>
      </el-tab-pane>
      <slot name="additional_tabs"></slot>
    </el-tabs>
    <slot></slot>
  </div>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import TabMixin from '@/utils/tab-mixin'
import Info from './customers-details/info.vue'
import Services from './customers-details/services.vue'
import Finance from './customers-details/finance.vue'
import CustomerTaskHistory from './customers-details/customer-task-history.vue'
import TrafReport from './customers-details/traf-report.vue'
import { CustomerModule } from '@/store/modules/customers/customer'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import { IWsMessage, IWsMessageEventTypeEnum } from '@/layout/mixin/ws'

interface ICustomerUpdateEventData {
  customer_id: number
}

@Component({
  name: 'CustomerDetails',
  components: {
    Info,
    Services,
    Finance,
    CustomerTaskHistory,
    TrafReport
  }
})
export default class extends mixins(TabMixin) {
  @Prop({ default: 0 }) private uid!: number

  private loaded = false
  protected activeTabName = 'info'

  created() {
    // Subscribe for customer update event from server
    this.$eventHub.$on(IWsMessageEventTypeEnum.UPDATE_CUSTOMER, this.onCustomerServerUpdate)

    this.loadCustomer()
  }

  beforeDestroy() {
    this.$eventHub.$off(IWsMessageEventTypeEnum.UPDATE_CUSTOMER, this.onCustomerServerUpdate)
  }

  private async loadCustomer() {
    this.loaded = false
    await CustomerModule.GetCustomer(this.uid)
    this.loaded = true
    this.setCrumbs(this.$store.state.customer.address)
    document.title = this.$store.state.customer.full_name || this.$t('customers.customer').toString()
  }

  private onCustomerServerUpdate(msg: IWsMessage) {
    const dat = msg.data as ICustomerUpdateEventData
    if (dat.customer_id === this.uid) {
      this.loadCustomer()
    }
  }

  // Breadcrumbs
  private async setCrumbs(addrId: number) {
    if (addrId === 0) return
    await BreadcrumbsModule.SetCrumbs([
      {
        path: '/customers/',
        meta: {
          hidden: true,
          title: this.$t('addrs.addresses').toString()
        }
      },
      /* {
        path: { name: 'customerList', params: { addrId: addrId } },
        meta: {
          hidden: true,
          title: this.$store.state.customer.address_title || '-'
        }
      },*/
      {
        path: '',
        meta: {
          hidden: true,
          title: this.$store.state.customer.full_name || '-'
        }
      }
    ] as any)
  }
  // End Breadcrumbs
}
</script>
