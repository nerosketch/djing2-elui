<template lang="pug">
div
  datatable(
    :columns="tableColumns"
    :getData="loadVlans"
    :loading="vlansLoading"
    :heightDiff='170'
    ref='table'
  )
    template(v-slot:id="{row}") {{ row.id }}

    template(v-slot:title="{row}") {{ row.title }}

    template(v-slot:vid="{row}") {{ row.vid }}

    template(v-slot:ismng="{row}")
      el-checkbox(v-model="row.is_management" disabled) {{ row.is_management ? 'Да' : 'Нет'}}

    template(v-slot:oper="{row}")
      el-button-group
        el-button(icon="el-icon-edit" size="mini" @click="openEdit(row)")
        el-button(type="danger" icon="el-icon-delete" size="mini" @click="delVlan(row)")

    el-button(icon='el-icon-plus' size='mini' @click='openNew') Добавить

  el-dialog(
    :title="dialogTitle"
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
      'min-width': 70
    },
    {
      prop: 'title',
      label: 'Название',
      sortable: true,
      'min-width': 150
    },
    {
      prop: 'vid',
      label: 'VID',
      sortable: true,
      'min-width': 70
    },
    {
      prop: 'ismng',
      label: 'Управл.',
      'min-width': 80,
      align: DataTableColumnAlign.CENTER
    },
    {
      prop: 'oper',
      label: 'Oper',
      'min-width': 130,
      align: DataTableColumnAlign.CENTER
    }
  ]
  private vlans: IVlanIf[] = []
  private dialogVisible = false
  private vlansLoading = false

  get dialogTitle() {
    let w = 'Изменение'
    if (VlanIfModule.id === 0) {
      w = 'Добавление'
    }
    return `${w} vlan`
  }
  private async openEdit(vlan: IVlanIf) {
    await VlanIfModule.SET_ALL_VLAN(vlan)
    this.dialogVisible = true
  }
  private async openNew() {
    await VlanIfModule.RESET_ALL_VLAN()
    this.dialogVisible = true
  }

  private async delVlan(vlan: IVlanIf) {
    this.$confirm(`Ты действительно хочешь удалить влан "${vlan.title}"?`).then(async() => {
      await VlanIfModule.DelVlan(vlan.id)
      this.$message.success('Vlan удалён')
      this.$refs.table.GetTableData()
    })
  }

  private async loadVlans(params?: IDRFRequestListParameters) {
    this.vlansLoading = true
    if (params) {
      params['fields'] = 'id,title,vid,is_management'
    }
    const r = await getVlans(params)
    this.vlansLoading = false
    return r
  }

  private frmDone() {
    this.dialogVisible = false
    this.$refs.table.GetTableData()
  }
}
</script>
