<template lang="pug">
  div
    el-table(
      v-loading="loading"
      :data="services"
      border
      fit)
      el-table-column(
        align="center"
        :label="$t('customers.orderShortText')"
        width="60")
        template(v-slot:default="{row}")
          el-button(
            type="primary"
            @click="buyOpen(row)"
            :disabled="isServiceAvailable || !$perms.customers.can_buy_service"
            icon="el-icon-shopping-cart-2"
            circle)

      el-table-column(:label="$t('customers.service')" prop="title")

      el-table-column(:label="$t('customers.sum')" prop="cost")

      el-table-column(:label="$t('customers.inSpeed')" prop="speed_in")

      el-table-column(:label="$t('customers.outSpeed')" prop="speed_out")

    el-button(
      @click="srvAccDialog=true"
      icon="el-icon-s-tools"
      type="primary")
      | {{ $t('customers.attachServices2Groups') }}

    el-dialog(
      :title="$t('customers.belongingServices2Groups')"
      :visible.sync="srvAccDialog"
      :close-on-click-modal="false")
      service-accessory(
        v-on:done="srvAccDone"
        :groupId="$store.state.customer.group"
      )

    el-dialog(
      :title="$t('customers.buyService')"
      :visible.sync="buyDialog"
      :close-on-click-modal="false")
      buy-service(
        v-on:done="buyDone"
        :services="services"
        :selectedServiceId="selectedServiceId")
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { IService } from '@/api/services/types'
import { getServices } from '@/api/services/req'
import { CustomerModule } from '@/store/modules/customers/customer'
import ServiceAccessory from './service-accessory.vue'
import BuyService from './buyService.vue'

@Component({
  name: 'ServicesList',
  components: {
    ServiceAccessory,
    BuyService
  }
})
export default class extends Vue {
  @Prop({ default: false })
  private isServiceAvailable!: boolean

  private loading = false
  private services: IService[] = []
  private srvAccDialog = false
  private selectedServiceId = 0
  private buyDialog = false

  private async loadServices() {
    this.loading = true
    try {
      const { data } = await getServices({
        page: 1,
        page_size: 0,
        groups: CustomerModule.group
      })
      this.services = data as IService[]
    } finally {
      this.loading = false
    }
  }

  created() {
    this.loadServices()
  }

  srvAccDone() {
    this.srvAccDialog = false
    this.loadServices()
  }

  buyOpen(s: IService) {
    if (s.cost > CustomerModule.balance) {
      this.$confirm(
        this.$tc('customers.customerNotEnoughMoneyDoConnectItQuestion'), {
          confirmButtonText: this.$tc('yes'),
          cancelButtonText: this.$tc('no'),
          type: 'warning'
        }
      ).then(() => {
        this.selectedServiceId = s.id
        this.buyDialog = true
      }).catch(() => {
        this.$message.info(
          this.$tc('customers.buyServiceCancellation')
        )
      })
    } else {
      this.selectedServiceId = s.id
      this.buyDialog = true
    }
  }

  buyDone() {
    this.buyDialog = false
    this.$message.success(
      this.$tc('customers.buyServiceOk')
    )
    CustomerModule.UpdateCustomer()
    this.$emit('buydone')
  }
}
</script>
