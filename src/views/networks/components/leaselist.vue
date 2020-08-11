<template lang="pug">
div
  datatable(
    :columns="tableColumns"
    :getData="loadLeases"
    :loading="leaseLoading"
    :heightDiff='142'
    ref='table'
  )
    template(v-slot:id="{row}") {{ row.id }}

    template(v-slot:ip_address="{row}") {{ row.ip_address }}

    template(v-slot:lease_time="{row}") {{ row.lease_time }}

    template(v-slot:mac_address="{row}") {{ row.mac_address }}

    template(v-slot:is_dynamic="{row}")
      el-checkbox(v-model="row.is_dynamic" disabled) {{ row.is_dynamic ? 'Да' : 'Нет' }}

    template(v-slot:oper="{row}")
      el-button-group
        el-button(icon="el-icon-edit" size="mini" @click="openEdit(row)")
        el-button(type="danger" icon="el-icon-delete" size="mini" @click="delLease(row)")

  el-dialog(
    title="Изменение Сессии"
    :visible.sync="dialogVisible"
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
      'min-width': 70
    },
    {
      prop: 'ip_address',
      label: 'IP Адрес',
      sortable: true,
      'min-width': 130
    },
    {
      prop: 'lease_time',
      label: 'Время создания аренды',
      sortable: true,
      'min-width': 200
    },
    {
      prop: 'mac_address',
      label: 'MAC Адрес',
      sortable: true,
      'min-width': 150
    },
    {
      prop: 'is_dynamic',
      label: 'Динамический'
    },
    {
      prop: 'oper',
      label: 'Oper',
      'min-width': 130,
      align: DataTableColumnAlign.CENTER
    }
  ]
  private dialogVisible = false
  private leaseLoading = false

  private async openEdit(lease: ICustomerIpLease) {
    await CustomerIpLeaseModule.SET_ALL_LEASE(lease)
    this.dialogVisible = true
  }

  private async delLease(lease: ICustomerIpLease) {
    this.$confirm(`Ты действительно хочешь удалить сессию "${lease.ip_address}"?`).then(async() => {
      await CustomerIpLeaseModule.DelLease(lease.id)
      this.$message.success('Сессия удалена')
      this.$refs.table.GetTableData()
    })
  }

  private async loadLeases(params?: IDRFRequestListParameters) {
    this.leaseLoading = true
    if (params) {
      params['fields'] = 'id,ip_address,lease_time,mac_address,is_dynamic'
    }
    const r = await getCustomerIpLeases(params)
    this.leaseLoading = false
    return r
  }

  private frmDone() {
    this.dialogVisible = false
    this.$message.success('Сессия изменена')
    this.$refs.table.GetTableData()
    // this.loadLeases()
  }
}
</script>
