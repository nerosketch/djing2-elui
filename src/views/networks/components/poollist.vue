<template lang="pug">
div
  datatable(
    :columns="tableColumns"
    :getData="loadPools"
    :heightDiff='188'
    :editFieldsVisible.sync="editFieldsVisible"
    widthStorageNamePrefix='pools'
    ref='table'
  )
    template(v-slot:is_dynamic="{row}")
      el-checkbox(v-model="row.is_dynamic" disabled)

    template(v-slot:oper="{row}")
      el-button-group
        el-button(
          v-if="$perms.is_superuser"
          @click="openSitesDlg(row)"
          size="mini"
        ) C
        el-button(icon="el-icon-edit" size="mini" @click="openEdit(row)")
        el-button(
          type="danger" icon="el-icon-delete" size="mini"
          @click="delPool(row)"
          :disabled="!$perms.networks.delete_networkippool"
        )

    el-button-group
      el-button(
        icon='el-icon-plus' size='mini'
        @click='openNew'
        :disabled="!$perms.networks.add_networkippool"
      ) Добавить
      el-button(
        icon='el-icon-s-operation'
        size='mini'
        @click="editFieldsVisible=true"
      ) Поля

  el-dialog(
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
  )
    pool-form(
      v-on:done="frmDone"
    )
  el-dialog(
    title="Принадлежность сайтам"
    :visible.sync="sitesDlg"
    :close-on-click-modal="false"
  )
    sites-attach(
      :selectedSiteIds="$store.state.netpool.sites"
      v-on:save="netpoolSitesSave"
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
      prop: 'vid',
      label: 'vid',
      'min-width': 100,
      align: DataTableColumnAlign.CENTER
    },
    {
      prop: 'oper',
      label: 'Кнопки',
      'min-width': 160,
      align: DataTableColumnAlign.CENTER
    }
  ]
  private pools: INetworkIpPool[] = []
  private dialogVisible = false
  private sitesDlg = false
  private editFieldsVisible = false

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
    this.$confirm(`Действительно удалить пул "${pool.network}"?`).then(async() => {
      await NetworkIpPoolModule.DelPool(pool.id)
      this.$message.success('Подсеть удалена')
      this.$refs.table.GetTableData()
    })
  }

  private async loadPools(params?: IDRFRequestListParameters) {
    if (params) {
      params['fields'] = 'id,network,description,ip_start,ip_end,gateway,is_dynamic,groups,usage_count,sites,vid,vlan_if,kind'
    }
    return getNetworkIpPools(params)
  }

  private frmDone() {
    this.dialogVisible = false
    this.$message.success('Подсеть сохранена')
    this.$refs.table.GetTableData()
  }

  private netpoolSitesSave(selectedSiteIds: number[]) {
    NetworkIpPoolModule.PatchPool({
      sites: selectedSiteIds
    }).then(() => {
      this.$refs.table.GetTableData()
      this.$message.success('Принадлежность подсети сайтам сохранена')
    })
    this.sitesDlg = false
  }
  private openSitesDlg(net: INetworkIpPool) {
    NetworkIpPoolModule.SET_ALL_POOL(net)
    this.sitesDlg = true
  }
}
</script>
