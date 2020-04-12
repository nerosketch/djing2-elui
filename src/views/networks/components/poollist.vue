<template lang="pug">
div
  datatable(
    :columns="tableColumns"
    :getData="loadPools"
    :loading="poolsLoading"
    ref='table'
  )
    span(slot="id" slot-scope="{row}") {{ row.id }}
    span(slot="network" slot-scope="{row}") {{ row.network }}
    span(slot="description" slot-scope="{row}") {{ row.description }}
    span(slot="ip_start" slot-scope="{row}") {{ row.ip_start }}
    span(slot="ip_end" slot-scope="{row}") {{ row.ip_end }}
    span(slot="gateway" slot-scope="{row}") {{ row.gateway }}
    el-button-group(slot="oper" slot-scope="{row}")
      el-button(icon="el-icon-edit" size="mini" @click="openEdit(row)")
      el-button(type="danger" icon="el-icon-delete" size="mini" @click="delPool(row)")

  el-dialog(
    title="Изменение Подсети"
    :visible.sync="dialogVisible"
    width="30%"
  )
    pool-form(
      v-on:done="frmDone"
    )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { IDRFRequestListParameters } from '@/api/types'
import { INetworkIpPool } from '@/api/networks/types'
import { getNetworkIpPools } from '@/api/networks/req'
import { NetworkIpPoolModule } from '@/store/modules/networks/netw_pool'
import PoolForm from './pool-form.vue'

class DataTableComp extends DataTable<INetworkIpPool> {}

@Component({
  name: 'VlanList',
  components: { 'datatable': DataTableComp, PoolForm }
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
      prop: 'network',
      label: 'Подсеть',
      sortable: true
    },
    {
      prop: 'description',
      label: 'Описание'
    },
    {
      prop: 'ip_start',
      label: 'нач. ip',
      sortable: true,
      align: DataTableColumnAlign.CENTER
    },
    {
      prop: 'ip_end',
      label: 'кон. ip',
      sortable: true,
      align: DataTableColumnAlign.CENTER
    },
    {
      prop: 'gateway',
      label: 'шлюз',
      sortable: true,
      align: DataTableColumnAlign.CENTER
    },
    {
      prop: 'oper',
      label: 'Oper',
      width: 130,
      align: DataTableColumnAlign.CENTER
    }
  ]
  private pools: INetworkIpPool[] = []
  private dialogVisible = false
  private poolsLoading = false

  created() {
    this.loadPools()
  }

  private async openEdit(vlan: INetworkIpPool) {
    await NetworkIpPoolModule.SET_ALL(vlan)
    this.dialogVisible = true
  }

  private async delPool(vlan: INetworkIpPool) {
    if (confirm(`Ты действительно хочешь удалить пул "${vlan.network}"?`)) {
      await NetworkIpPoolModule.DelPool(vlan.id)
      this.$refs['table'].GetTableData()
    }
  }

  private async loadPools(params?: IDRFRequestListParameters) {
    this.poolsLoading = true
    const r = await getNetworkIpPools(params)
    let vlans = r.data.results
    this.poolsLoading = false
    return r
  }

  private frmDone() {
    this.dialogVisible = false
    this.$refs['table'].GetTableData()
    this.loadPools()
  }
}
</script>
