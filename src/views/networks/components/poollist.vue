<template lang="pug">
div
  datatable(
    :columns="tableColumns"
    :getData="loadPools"
    :loading="poolsLoading"
    :heightDiff='170'
    widthStorageNamePrefix='pools'
    ref='table'
  )
    template(v-slot:id="{row}") {{ row.id }}

    template(v-slot:network="{row}") {{ row.network }}

    template(v-slot:description="{row}") {{ row.description }}

    template(v-slot:ip_start="{row}") {{ row.ip_start }}

    template(v-slot:ip_end="{row}") {{ row.ip_end }}

    template(v-slot:gateway="{row}") {{ row.gateway }}

    template(v-slot:is_dynamic="{row}")
      el-checkbox(v-model="row.is_dynamic" disabled)

    template(v-slot:usage_count="{row}") {{ row.usage_count }}

    template(v-slot:oper="{row}")
      el-button-group
        el-button(icon="el-icon-edit" size="mini" @click="openEdit(row)")
        el-button(type="danger" icon="el-icon-delete" size="mini" @click="delPool(row)")

    el-button(icon='el-icon-plus' size='mini' @click='openNew') Добавить

  el-dialog(
    :title="dialogTitle"
    :visible.sync="dialogVisible"
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
  name: 'PoolList',
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
      'min-width': 70
    },
    {
      prop: 'network',
      label: 'Подсеть',
      sortable: true,
      'min-width': 150
    },
    {
      prop: 'description',
      label: 'Описание',
      'min-width': 300
    },
    {
      prop: 'ip_start',
      label: 'нач. ip',
      sortable: true,
      align: DataTableColumnAlign.CENTER,
      'min-width': 150
    },
    {
      prop: 'ip_end',
      label: 'кон. ip',
      sortable: true,
      align: DataTableColumnAlign.CENTER,
      'min-width': 150
    },
    {
      prop: 'gateway',
      label: 'шлюз',
      sortable: true,
      align: DataTableColumnAlign.CENTER,
      'min-width': 150
    },
    {
      prop: 'is_dynamic',
      label: 'Д',
      'min-width': 40,
      align: DataTableColumnAlign.CENTER
    },
    {
      prop: 'usage_count',
      label: 'Выделено',
      'min-width': 100,
      align: DataTableColumnAlign.CENTER
    },
    {
      prop: 'oper',
      label: 'Oper',
      'min-width': 130,
      align: DataTableColumnAlign.CENTER
    }
  ]
  private pools: INetworkIpPool[] = []
  private dialogVisible = false
  private poolsLoading = false

  get dialogTitle() {
    let w = 'Изменить'
    if (NetworkIpPoolModule.id === 0) {
      w = 'Добавить'
    }
    return `${w} подсеть`
  }
  private async openEdit(pool: INetworkIpPool) {
    await NetworkIpPoolModule.SET_ALL_POOL(pool)
    this.dialogVisible = true
  }
  private async openNew() {
    await NetworkIpPoolModule.RESET_ALL_POOL()
    this.dialogVisible = true
  }

  private delPool(pool: INetworkIpPool) {
    this.$confirm(`Ты действительно хочешь удалить пул "${pool.network}"?`).then(async() => {
      await NetworkIpPoolModule.DelPool(pool.id)
      this.$message.success('Подсеть удалена')
      this.$refs.table.GetTableData()
    })
  }

  private async loadPools(params?: IDRFRequestListParameters) {
    this.poolsLoading = true
    if (params) {
      params['fields'] = 'id,network,description,ip_start,ip_end,gateway,is_dynamic,groups,usage_count'
    }
    const r = await getNetworkIpPools(params)
    this.poolsLoading = false
    return r
  }

  private frmDone() {
    this.dialogVisible = false
    this.$message.success('Подсеть сохранена')
    this.$refs.table.GetTableData()
  }
}
</script>
