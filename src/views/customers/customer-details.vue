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

  template(#additional_tabs)
    slot(name="additional_tabs") def

  slot

</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Info from './customers-details/info.vue'
import Services from './customers-details/services.vue'
import Finance from './customers-details/finance.vue'
import CustomerTaskHistory from './customers-details/customer-task-history.vue'
import Tabs, { ICustomTabItem } from '@/components/tabs/tabs.vue'
import { CustomerModule } from '@/store/modules/customers/customer'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import { IWsMessage, IWsMessageEventTypeEnum } from '@/layout/mixin/ws'
import { CurrentPermissions } from '@/store/current-user-permissions'
import { getAddressByType } from '@/api/addresses/req'
import { IAddressModel } from '@/api/addresses/types'

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
  }
})
export default class extends Vue {
  private $perms!: CurrentPermissions

  @Prop({ default: 0 }) private uid!: number

  private loaded = false

  private localityDetail: IAddressModel | null = null

  private async loadLocalityDetail(addrId: number, addrType: number) {
    if (addrId) {
      const { data } = await getAddressByType(addrId, addrType)
      this.localityDetail = data
    }
  }

  created() {
    // Subscribe for customer update event from server
    this.$eventHub.$on(IWsMessageEventTypeEnum.UPDATE_CUSTOMER, this.onCustomerServerUpdate)

    this.loadCustomer()

    this.loadLocalityDetail(this.$store.state.customer.address_id, 4)
  }

  @Watch('localityDetail')
  private onChLocDet(lc: IAddressModel | null) {
    if (lc) {
      this.setCrumbs(lc.id)
    }
  }
  @Watch('$store.state.customer.address_id')
  private onChCustomerAddr(addrId: number) {
    this.loadLocalityDetail(addrId, 4)
  }

  beforeDestroy() {
    this.$eventHub.$off(IWsMessageEventTypeEnum.UPDATE_CUSTOMER, this.onCustomerServerUpdate)
  }

  private async loadCustomer() {
    this.loaded = false
    await CustomerModule.GetCustomer(this.uid)
    this.loaded = true
    this.setCrumbs(this.$store.state.customer.address_id)
    document.title = this.$store.state.customer.full_name || this.$tc('customers.customer')
  }

  private tabItems: ICustomTabItem[] = [
    { title: this.$t('customers.info'), name: 'info' },
    { title: this.$t('route.services'), name: 'services', disabled: !this.$perms.customers.view_customerservice },
    { title: this.$t('route.finance'), name: 'fin', disabled: !this.$perms.customers.view_customerlog },
    { title: this.$t('customers.taskHistory'), name: 'history', disabled: !this.$perms.tasks.view_task },
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
      this.localityDetail ? {
        path: { name: 'customerList', params: { addrId: this.localityDetail.id } },
        meta: {
          hidden: true,
          title: this.localityDetail.title
        }
      } : {
        path: '',
        meta: {
          hidden: true,
          title: '-'
        }
      },
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
