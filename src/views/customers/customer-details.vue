<template lang="pug">
  .app-container
    span Баланс:
    small  {{ $store.state.customer.balance }}.
    span  Создан:
    small  {{ $store.state.customer.create_date }}
    el-tabs.border-card
      el-tab-pane(label="Инфо" lazy)
        keep-alive
          info(v-if='loaded')
      el-tab-pane(label="Тарифы" lazy :disabled="!$perms.customers.view_customerservice")
        keep-alive
          services(v-if='loaded')
      el-tab-pane(label="Финансы" lazy :disabled="!$perms.customers.view_customerlog")
        keep-alive
          finance
      el-tab-pane(label="История задач" lazy :disabled="!$perms.tasks.view_task")
        keep-alive
          customer-task-history
      el-tab-pane(label="История трафика" lazy)
        keep-alive
          el-card
            template(v-slot:header) История трафика
            traf-report(
              :customerId="uid"
            )
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Prop, Vue } from 'vue-property-decorator'
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
export default class extends Vue {
  @Prop({ default: 0 }) private uid!: number

  private loaded = false

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
    this.setCrumbs(this.$store.state.customer.address)
    this.loaded = true
    document.title = this.$store.state.customer.full_name || 'Абонент'
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
          title: 'Населённые пункты'
        }
      },
      /* {
        path: { name: 'customersList', params: { addrId: addrId } },
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
