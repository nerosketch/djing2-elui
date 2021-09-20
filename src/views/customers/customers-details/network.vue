<template lang="pug">
  el-card(shadow="never")
    template(v-slot:header)
      .clearfix Сетевое
    el-table(
      v-loading='loading'
      :data="leases"
      border fit
    )
      el-table-column(
        label="IP Адрес"
        min-width='110'
        prop='ip_address'
      )
      el-table-column(
        label="MAC Адрес"
        min-width='110'
        prop='mac_address'
      )
      el-table-column(
        label="Время аренды"
        min-width='110'
        prop='lease_time'
      )
      el-table-column(
        label="Последнее обновление"
        min-width='110'
        prop='last_update'
      )
      el-table-column(
        label="Авто"
        align="center"
        width="50"
      )
        template(v-slot:default="{row}")
          i.el-icon-circle-check(v-if="row.is_dynamic")
      el-table-column(
        label="#"
        align="center"
        width="259"
      )
        template(v-slot:default="{row}")
          el-button-group
            el-button(
              type='danger'
              icon='el-icon-delete'
              @click="delLease(row)"
            )
            el-button(
              type='primary'
              icon='el-icon-edit'
              @click="editLease(row)"
            )
            lease-ping(:lease="row")
            ip-session-detail(:lease="row")
    el-button(
      type='success' icon='el-icon-plus',
      @click="addLease"
    ) Добавить

    el-dialog(
      :title="(isAddNewLease ? 'Добавить' : 'Изменить') + ' аренду ip'"
      :visible.sync='editDialog'
      :close-on-click-modal="false"
    )
      customer-lease-form(
        :isAddNewLease="isAddNewLease"
        v-on:done="leaseFrmDone"
        v-on:cancel="editDialog=false"
        ref="customerleaseformref"
      )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ICustomerIpLease } from '@/api/networks/types'
import { getCustomerIpLeases } from '@/api/networks/req'
import { CustomerIpLeaseModule } from '@/store/modules/networks/ip_lease'
import LeasePing from '@/components/MyButtons/leaseping.vue'
import CustomerLeaseForm from './customer-lease-form.vue'
import IpSessionDetail from './ip-session-detail.vue'
import { IWsMessage, IWsMessageEventTypeEnum } from '@/layout/mixin/ws'

@Component({
  name: 'Network',
  components: {
    LeasePing,
    CustomerLeaseForm,
    IpSessionDetail
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
    } catch (err) {
      this.$message.error(err)
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
    this.$confirm('Удалить аренду ip? Абонент больше не сможет получать услугу через этот ip.', {
      confirmButtonText: 'OK',
      cancelButtonText: 'Нет'
    }).then(async() => {
      try {
        await CustomerIpLeaseModule.DelLease(lease.id)
        this.$message.success('Аренда удалена')
        this.loadLeases()
      } catch (err) {
        this.$message.error(err)
      }
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
}
</script>
