<template lang="pug">
  div
    datatable(
      :columns="tableColumns"
      :getData="loadLeases"
      :heightDiff="160"
      widthStorageNamePrefix="leases"
      ref="table")
      template(v-slot:is_dynamic="{row}")
        el-checkbox(v-model="row.is_dynamic", disabled)
          | {{ row.is_dynamic ? 'Да' : 'Нет' }}
    
      template(v-slot:oper="{row}")
        el-button-group
          el-button(icon="el-icon-edit", @click="openEdit(row)")
        
          el-button(
            type="danger"
            icon="el-icon-delete"
            @click="delLease(row)"
            :disabled="!$perms.networks.delete_customeripleasemodel")
  
    el-dialog(
      :title="$t('modificationOfSessions')"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false")
      lease-form(v-on:done="frmDone")
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
  components: { datatable: DataTableComp, LeaseForm }
})
export default class extends Vue {
  public readonly $refs!: {
    table: DataTableComp
  }

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'ip_address',
      label: this.$t('idres'),
      sortable: true,
      'min-width': 130
    },
    {
      prop: 'lease_time',
      label: this.$t('leasingTime'),
      sortable: true,
      'min-width': 200
    },
    {
      prop: 'last_update',
      label: this.$t('lastUpdate'),
      'min-width': 200
    },
    {
      prop: 'mac_address',
      label: this.$t('maqueres'),
      sortable: true,
      'min-width': 150
    },
    {
      prop: 'is_dynamic',
      label: this.$t('dynamic')
    },
    {
      prop: 'op.',
      label: this.$t('op.'),
      'min-width': 130,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private dialogVisible = false

  private async openEdit(lease: ICustomerIpLease) {
    await CustomerIpLeaseModule.SET_ALL_LEASE(lease)
    this.dialogVisible = true
  }

  private async delLease(lease: ICustomerIpLease) {
    this.$confirm(this.$t('deistvitelno-udalit-sessiyu-lease-ip_address', [lease.ip_address])).then(async() => {
      await CustomerIpLeaseModule.DelLease(lease.id)
      this.$message.success(this.$t('sessionRemoved'))
      this.$refs.table.LoadTableData()
    })
  }

  private loadLeases(params?: IDRFRequestListParameters) {
    if (params) {
      params.fields = 'id,ip_address,lease_time,last_update,mac_address,is_dynamic'
    }
    return getCustomerIpLeases(params)
  }

  private frmDone() {
    this.dialogVisible = false
    this.$message.success(this.$t('sessionChanged'))
    this.$refs.table.LoadTableData()
    // this.loadLeases()
  }
}
</script>
