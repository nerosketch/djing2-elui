<template lang="pug">
div
  datatable(
    :columns="tableColumns"
    :getData="loadLeases"
    :loading="leaseLoading"
    ref='table'
  )
    span(slot="id" slot-scope="{row}") {{ row.id }}
    span(slot="ip_address" slot-scope="{row}") {{ row.ip_address }}
    span(slot="lease_time" slot-scope="{row}") {{ row.lease_time }}
    span(slot="mac_address" slot-scope="{row}") {{ row.mac_address }}
    el-checkbox(v-model="row.is_dynamic" slot="is_dynamic" slot-scope="{row}" disabled) {{ row.is_dynamic ? 'Да' : 'Нет' }}
    el-button-group(slot="oper" slot-scope="{row}")
      el-button(icon="el-icon-edit" size="mini" @click="openEdit(row)")
      el-button(type="danger" icon="el-icon-delete" size="mini" @click="delPool(row)")

  el-dialog(
    title="Изменение Сессии"
    :visible.sync="dialogVisible"
    width="30%"
  )
    lease-form(
      v-on:done="frmDone"
    )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { IDRFRequestListParameters } from '@/api/types'
import { ICustomerIpLease } from '@/api/networks/types'
import { getCustomerIpLeases } from '@/api/networks/req'
import { CustomerIpLeaseModule } from '@/store/modules/networks/ip_lease'
import LeaseForm from './lease-form.vue'

class DataTableComp extends DataTable<ICustomerIpLease> {}

@Component({
  name: 'LeaseList',
  components: { 'datatable': DataTableComp, LeaseForm }
})
export default class extends Vue {
  public readonly $refs!: {
    table: DataTableComp
  }
  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'id',
      label: 'ID',
      width: 70
    },
    {
      prop: 'ip_address',
      label: 'IP Адрес',
      sortable: true
    },
    {
      prop: 'lease_time',
      label: 'Время создания аренды',
      sortable: true
    },
    {
      prop: 'mac_address',
      label: 'MFC Адрес',
      sortable: true
    },
    {
      prop: 'is_dynamic',
      label: 'Динамический'
    },
    {
      prop: 'oper',
      label: 'Oper',
      width: 130,
      align: DataTableColumnAlign.CENTER
    }
  ]
  private leases: ICustomerIpLease[] = []
  private dialogVisible = false
  private leaseLoading = false

  created() {
    this.loadLeases()
  }

  private async openEdit(lease: ICustomerIpLease) {
    await CustomerIpLeaseModule.SET_ALL(lease)
    this.dialogVisible = true
  }

  private async delLease(lease: ICustomerIpLease) {
    if (confirm(`Ты действительно хочешь удалить сессию "${lease.ip_address}"?`)) {
      await CustomerIpLeaseModule.DelLease(lease.id)
      this.$refs['table'].GetTableData()
    }
  }

  private async loadLeases(params?: IDRFRequestListParameters) {
    this.leaseLoading = true
    const r = await getCustomerIpLeases(params)
    let leases = r.data.results
    this.leaseLoading = false
    return r
  }

  private frmDone() {
    this.dialogVisible = false
    this.$refs['table'].GetTableData()
    this.loadLeases()
  }
}
</script>
