<template lang="pug">
  div
    datatable(
      :columns="tableColumns"
      :getData="loadPools"
      :heightDiff="188"
      :editFieldsVisible.sync="editFieldsVisible"
      widthStorageNamePrefix="pools"
      ref="table")
      template(v-slot:is_dynamic="{row}")
        boolean-icon(v-model="row.is_dynamic")

      template(v-slot:oper="{row}")
        el-button-group
          el-button(v-if="$perms.is_superuser" @click="openSitesDlg(row)")
            | C

          //- el-button(icon="el-icon-edit" @click="openEdit(row)")
          el-button(icon="el-icon-edit" disabled)

          el-button(
            type="danger"
            icon="el-icon-delete"
            @click="delPool(row)"
            :disabled="!$perms.networks.delete_networkippool")

      el-button-group
        el-button(
          icon="el-icon-plus"
          @click="openNew"
        )
          | {{ $t('add') }}

        el-button(icon="el-icon-s-operation" @click="editFieldsVisible=true")
          | {{ $t('field') }}

    el-dialog(
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false")
      pool-form(v-on:done="frmDone")

    el-dialog(
      :title="$t('facilities')"
      :visible.sync="sitesDlg"
      :close-on-click-modal="false")
      sites-attach(:selectedSiteIds="$store.state.netpool.sites" v-on:save="netpoolSitesSave")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { IDRFRequestListParameters } from '@/api/types'
import { INetworkIpPool } from '@/api/networks/types'
import { getNetworkIpPools } from '@/api/networks/req'
import { NetworkIpPoolModule } from '@/store/modules/networks/netw_pool'
import PoolForm from './pool-form.vue'
import BooleanIcon from '@/components/boolean-icon.vue'

class DataTableComp extends DataTable<INetworkIpPool> {}

@Component({
  name: 'PoolList',
  components: {
    datatable: DataTableComp,
    PoolForm,
    BooleanIcon
  }
})
export default class extends Vue {
  public readonly $refs!: {
    table: DataTableComp
  }

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'network',
      label: this.$tc('subnet'),
      sortable: true,
      'min-width': 150
    },
    {
      prop: 'description',
      label: this.$tc('description'),
      'min-width': 300
    },
    {
      prop: 'ip_start',
      label: this.$tc('startIp'),
      sortable: true,
      align: DataTableColumnAlign.CENTER,
      'min-width': 150
    },
    {
      prop: 'ip_end',
      label: this.$tc('ipend'),
      sortable: true,
      align: DataTableColumnAlign.CENTER,
      'min-width': 150
    },
    {
      prop: 'gateway',
      label: this.$tc('gateway'),
      sortable: true,
      align: DataTableColumnAlign.CENTER,
      'min-width': 150
    },
    {
      prop: 'is_dynamic',
      label: 'D',
      'min-width': 40,
      align: DataTableColumnAlign.CENTER
    },
    {
      prop: 'usage_count',
      label: this.$tc('issued'),
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
      label: this.$tc('buttons'),
      'min-width': 160,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private pools: INetworkIpPool[] = []
  private dialogVisible = false
  private sitesDlg = false
  private editFieldsVisible = false

  get dialogTitle() {
    let w
    if (NetworkIpPoolModule.id === 0) {
      w = this.$tc('add')
    } else {
      w = this.$tc('change')
    }
    return this.$tc('networks.tPool', 1, [w])
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
    this.$confirm(this.$tc('aus2delIpPool', 1, [pool.network])).then(async() => {
      await NetworkIpPoolModule.DelPool(pool.id)
      this.$message.success(this.$tc('substanceRemoved'))
      this.$refs.table.LoadTableData()
    })
  }

  private async loadPools(params?: IDRFRequestListParameters) {
    if (params) {
      params.fields = 'id,network,description,ip_start,ip_end,gateway,is_dynamic,groups,usage_count,sites,vid,vlan_if,kind'
    }
    return getNetworkIpPools(params)
  }

  private frmDone() {
    this.dialogVisible = false
    this.$message.success(this.$tc('substanceRetained'))
    this.$refs.table.LoadTableData()
  }

  private netpoolSitesSave(selectedSiteIds: number[]) {
    NetworkIpPoolModule.PatchPool({
      sites: selectedSiteIds
    }).then(() => {
      this.$refs.table.LoadTableData()
      this.$message.success(this.$tc('webOwnershipMaintained'))
    })
    this.sitesDlg = false
  }

  private openSitesDlg(net: INetworkIpPool) {
    NetworkIpPoolModule.SET_ALL_POOL(net)
    this.sitesDlg = true
  }
}
</script>
