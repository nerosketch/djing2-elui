<template lang="pug">
div
  datatable(
    :columns="tableColumns"
    :getData="loadVlans"
    :loading="vlansLoading"
    ref='table'
  )
    span(slot="id" slot-scope="{row}") {{ row.id }}
    span(slot="title" slot-scope="{row}") {{ row.title }}
    span(slot="vid" slot-scope="{row}") {{ row.vid }}
    el-checkbox(v-model="row.is_management" slot="ismng" slot-scope="{row}" disabled) {{ row.is_management ? 'Да' : 'Нет'}}
    el-button-group(slot="oper" slot-scope="{row}")
      el-button(icon="el-icon-edit" size="mini" @click="openEdit(row)")
      el-button(type="danger" icon="el-icon-delete" size="mini" @click="delVlan(row)")

  el-dialog(
    title="Изменение vlan"
    :visible.sync="dialogVisible"
  )
    vlan-form(
      v-on:done="frmDone"
    )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { IDRFRequestListParameters } from '@/api/types'
import { IVlanIf } from '@/api/networks/types'
import { getVlans } from '@/api/networks/req'
import { VlanIfModule } from '@/store/modules/networks/vlan'
import VlanForm from './vlan-form.vue'

class DataTableComp extends DataTable<IVlanIf> {}

@Component({
  name: 'VlanList',
  components: { 'datatable': DataTableComp, VlanForm }
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
      prop: 'title',
      label: 'Название',
      sortable: true
    },
    {
      prop: 'vid',
      label: 'VID',
      sortable: true,
      width: 70
    },
    {
      prop: 'ismng',
      label: 'Управл.',
      width: 80,
      align: DataTableColumnAlign.CENTER
    },
    {
      prop: 'oper',
      label: 'Oper',
      width: 130,
      align: DataTableColumnAlign.CENTER
    }
  ]
  private vlans: IVlanIf[] = []
  private dialogVisible = false
  private vlansLoading = false

  created() {
    this.loadVlans()
  }

  private async openEdit(vlan: IVlanIf) {
    await VlanIfModule.SET_ALL_VLAN(vlan)
    this.dialogVisible = true
  }

  private async delVlan(vlan: IVlanIf) {
    if (confirm(`Ты действительно хочешь удалить влан "${vlan.title}"?`)) {
      await VlanIfModule.DelVlan(vlan.id)
      this.$refs['table'].GetTableData()
    }
  }

  private async loadVlans(params?: IDRFRequestListParameters) {
    this.vlansLoading = true
    const r = await getVlans(params)
    this.vlansLoading = false
    return r
  }

  private frmDone() {
    this.dialogVisible = false
    this.$refs['table'].GetTableData()
  }
}
</script>
