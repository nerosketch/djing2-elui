<template lang="pug">
tabs(
  :tabs="tabItems"
  activeTabName="info"
)
  template(#head)
    span {{ $t('customers.balance') }}:
    small  {{ $store.state.customer.balance }}.
    span  {{ $t('dateOfEstablishment') }}
    small {{ $store.state.customer.create_date }}

  template(#info)
    info(v-if="loaded")
  template(#services)
    services(v-if="loaded")
  template(#fin)
    finance(v-if="loaded")
  template(#history)
    customer-task-history(v-if="loaded")
  template(#traf)
    el-card(v-if="loaded")
      template(#header)
        | {{ $t('customers.trafHistory') }}

      traf-report(:customerId="uid")

  slot(name="additional_tabs")

</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Prop, Vue } from 'vue-property-decorator'
import Info from './customers-details/info.vue'
import Services from './customers-details/services.vue'
import Finance from './customers-details/finance.vue'
import CustomerTaskHistory from './customers-details/customer-task-history.vue'
import TrafReport from './customers-details/traf-report.vue'
import Tabs, { ICustomTabItem } from '@/components/tabs/tabs.vue'
import { CustomerModule } from '@/store/modules/customers/customer'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import { IWsMessage, IWsMessageEventTypeEnum } from '@/layout/mixin/ws'
import { CurrentPermissions } from '@/store/current-user-permissions'

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
    Tabs,
    TrafReport
  }
})
export default class extends Vue {
  private $perms!: CurrentPermissions

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
    this.loaded = true
    this.setCrumbs(this.$store.state.customer.address)
    document.title = this.$store.state.customer.full_name || this.$tc('customers.customer')
  }

  private tabItems: ICustomTabItem[] = [
    { title: this.$t('customers.info'), name: 'info' },
    { title: this.$t('route.services'), name: 'services', disabled: !this.$perms.customers.view_customerservice },
    { title: this.$t('route.finance'), name: 'fin', disabled: !this.$perms.customers.view_customerlog },
    { title: this.$t('customers.taskHistory'), name: 'history', disabled: !this.$perms.tasks.view_task },
    { title: this.$t('customers.trafHistory'), name: 'traf' },
  ]

  private onCustomerServerUpdate(msg: IWsMessage) {
    const dat = msg.data as ICustomerUpdateEventData
    if (dat.customer_id === this.uid) {
      this.loadCustomer()
    }
  }

  // Breadcrumbs
  private setCrumbs(addrId: number) {
    if (addrId === 0) return
    BreadcrumbsModule.SetCrumbs([
      {
        path: '/customers/',
        meta: {
          hidden: true,
          title: this.$tc('addrs.addresses')
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
