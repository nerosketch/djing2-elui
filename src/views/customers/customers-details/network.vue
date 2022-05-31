<template lang="pug">
  el-card(shadow="never")
    template(v-slot:header)
      .clearfix
        | {{ $t('customers.networking') }}

    el-table(
      v-loading="loading"
      :data="leases"
      :row-class-name="leaseStatus"
      border
      fit)
      el-table-column(
        :label="$t('ipAddress')"
        min-width="110"
        prop="ip_address")

      el-table-column(
        :label="$t('macAddress')"
        min-width="110"
        prop="mac_address")

      el-table-column(
        :label="$t('customers.leaseTime')"
        min-width="110"
        prop="lease_time")

      el-table-column(
        :label="$t('customers.sessionLastUpdate')"
        min-width="110"
        prop="last_update")

      el-table-column(
        :label="$t('customers.auto')"
        align="center"
        width="50")
        template(v-slot:default="{row}")
          boolean-icon(v-model="row.is_dynamic")

      el-table-column(
        label="#"
        align="center"
        width="259")
        template(v-slot:default="{row}")
          el-button-group
            el-button(
              type="danger"
              icon="el-icon-delete"
              @click="delLease(row)")

            el-button(
              type="primary"
              icon="el-icon-edit"
              @click="editLease(row)")

            lease-ping(:lease="row")

            ip-lease-detail(:lease="row")

    el-button(
      type="success"
      icon="el-icon-plus"
      @click="addLease")
      | {{ $t('add') }}

    el-dialog(
      :title="(isAddNewLease ? $t('add') : $t('change')) + ' ' + $t('customers.sessionLease')"
      :visible.sync="editDialog"
      :close-on-click-modal="false")
      customer-lease-form(
        :isAddNewLease="isAddNewLease"
        v-on:done="leaseFrmDone"
        v-on:cancel="editDialog=false"
        ref="customerleaseformref")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ICustomerIpLease } from '@/api/networks/types'
import { getCustomerIpLeases } from '@/api/networks/req'
import { CustomerIpLeaseModule } from '@/store/modules/networks/ip_lease'
import LeasePing from '@/components/MyButtons/leaseping.vue'
import CustomerLeaseForm from './customer-lease-form.vue'
import IpLeaseDetail from './ip-lease-detail.vue'
import { IWsMessage, IWsMessageEventTypeEnum } from '@/layout/mixin/ws'
import BooleanIcon from '@/components/boolean-icon.vue'

interface ITableRowClassName {
  row: ICustomerIpLease
  rowIndex: number
}

@Component({
  name: 'Network',
  components: {
    LeasePing,
    CustomerLeaseForm,
    IpLeaseDetail,
    BooleanIcon
  }
})
export default class extends Vue {
  private leases: ICustomerIpLease[] = []
  private loading = false
  private editDialog = false
  private isAddNewLease = false

  public readonly $refs!: {
    customerleaseformref: CustomerLeaseForm
  }

  private async loadLeases() {
    this.loading = true
    try {
      const { data } = await getCustomerIpLeases(undefined, this.$store.state.customer.id)
      this.leases = data as ICustomerIpLease[]
    } finally {
      this.loading = false
    }
  }

  created() {
    // subscribe to customer update lease events
    this.$eventHub.$on(IWsMessageEventTypeEnum.UPDATE_CUSTOMER_LEASES, this.onSignalUpdateLeases)

    this.loadLeases()
  }

  beforeDestroy() {
    this.$eventHub.$off(IWsMessageEventTypeEnum.UPDATE_CUSTOMER_LEASES, this.onSignalUpdateLeases)
  }

  private async editLease(l: ICustomerIpLease) {
    this.editDialog = true
    this.isAddNewLease = false
    await this.$nextTick()
    this.$refs.customerleaseformref.editLease(JSON.parse(JSON.stringify(l)))
  }

  public delLease(lease: ICustomerIpLease) {
    this.$confirm(this.$tc('customers.areUSure2DelIpLease'), {
      confirmButtonText: this.$tc('yes'),
      cancelButtonText: this.$tc('no')
    }).then(async() => {
      const releasedCount = await CustomerIpLeaseModule.ReleaseLease(lease.id)
      if (releasedCount > 0) {
        this.$message.success(
          this.$tc('nets.ipLeaseSuccessfullyRemoved', 1, [releasedCount])
        )
      } else {
        this.$message.error(
          this.$tc('nets.ipLeaseNotFound')
        )
      }
      this.loadLeases()
    })
  }

  private async addLease() {
    this.editDialog = true
    this.isAddNewLease = true
    await this.$nextTick()
    this.$refs.customerleaseformref.addLease()
  }

  private leaseFrmDone() {
    this.loadLeases()
    this.editDialog = false
  }

  private onSignalUpdateLeases({ data }: IWsMessage) {
    if (data.customer_id === this.$store.state.customer.id) {
      this.loadLeases()
    }
  }

  private leaseStatus({ row }: ITableRowClassName) {
    if (!row.pool) {
      return 'error-row'
    }
  }
}
</script>
