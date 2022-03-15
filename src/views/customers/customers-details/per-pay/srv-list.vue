<template lang="pug">
  div
    el-table(
      v-loading="loading"
      :data="pservices"
      border
      fit)
      el-table-column(:label="$t('customers.lastPay')" prop="last_pay")

      el-table-column(:label="$t('customers.nextPay')" prop="next_pay")

      el-table-column(:label="$t('title')" prop="service_name")

      el-table-column(:label="$t('customers.calcType')" prop="service_calc_type")

      el-table-column(:label="$t('customers.cost')" prop="service_amount")

      el-table-column(:label="$t('del')")
        template(v-slot:default="{row}")
          el-button(
            icon="el-icon-close"
            circle
            type="danger"
            @click="delP4IdPay(row)")

    el-button(type="primary" @click="pSrvDialog=true")
      | {{ $t('customers.addPeriodicPay') }}

    el-dialog(
      :title="$t('customers.addPeriodicPay')"
      :visible.sync="pSrvDialog"
      :close-on-click-modal="false")
      add-p-pay(v-on:done="addPPayDone")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IPeriodicPayForId } from '@/api/customers/types'
import { getAssignedPeriodicPays, delAssignedPeriodicPay } from '@/api/customers/req'
import AddPPay from './add-p-pay.vue'

@Component({
  name: 'PeriodicServicesList',
  components: {
    AddPPay
  }
})
export default class extends Vue {
  private pservices: IPeriodicPayForId[] = []
  private loading = false
  private pSrvDialog = false

  created() {
    this.loadPIdServices()
  }

  private async loadPIdServices() {
    this.loading = true
    try {
      const { data } = await getAssignedPeriodicPays(
        this.$store.state.customer.id
      )
      this.pservices = data as unknown as IPeriodicPayForId[]
    } finally {
      this.loading = false
    }
  }

  private addPPayDone() {
    this.loadPIdServices()
    this.pSrvDialog = false
  }

  private delP4IdPay(pay: IPeriodicPayForId) {
    this.$confirm(
      this.$tc('customers.areUSure2DelPeriodicPay')
    ).then(async() => {
      await delAssignedPeriodicPay(pay.id)
      this.loadPIdServices()
      this.$message.success(
        this.$tc('deleted')
      )
    })
  }
}
</script>
