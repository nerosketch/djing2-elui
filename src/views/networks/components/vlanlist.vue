<template lang="pug">
div
  datatable(
    :columns="tableColumns"
    :getData="loadVlans"
    :heightDiff='170'
    widthStorageNamePrefix='vlans'
    ref='table'
  )
    template(v-slot:ismng="{row}")
      el-checkbox(v-model="row.is_management" disabled) {{ row.is_management ? 'Да' : 'Нет'}}

    template(v-slot:oper="{row}")
      el-button-group
        el-button(
          icon="el-icon-edit" size="mini"
          @click="openEdit(row)"
          :disabled="!$perms.networks.change_vlanif"
        )
        el-button(
          type="danger" icon="el-icon-delete" size="mini"
          @click="delVlan(row)"
          :disabled="!$perms.networks.delete_vlanif"
        )

    el-button(
      icon='el-icon-plus' size='mini'
      @click='openNew'
      :disabled="!$perms.networks.add_vlanif"
    ) Добавить

  el-dialog(
    :title="dialogTitle"
    :visible.sync="dialogVisible"
  )
    vlan-form(
      v-on:done="frmDone"
    )
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { RouteRecord } from 'vue-router'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { IVlanIf } from '@/api/networks/types'
import { VlanIfModule } from '@/store/modules/networks/vlan'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import VlanForm from './vlan-form.vue'
import VlanMixin from './vlan-mixin'

class DataTableComp extends DataTable<IVlanIf> {}

@Component({
  name: 'VlanList',
  components: { 'datatable': DataTableComp, VlanForm }
})
export default class extends mixins(VlanMixin) {
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
  private dialogVisible = false

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
    this.$confirm(`Действительно удалить влан "${vlan.title}"?`).then(async() => {
      await VlanIfModule.DelVlan(vlan.id)
      this.$message.success('Vlan удалён')
      this.$refs.table.GetTableData()
    })
  }

  private frmDone() {
    this.dialogVisible = false
    this.$refs.table.GetTableData()
  }

  // Breadcrumbs
  created() {
    BreadcrumbsModule.SetCrumbs([
      {
        path: '/',
        meta: {
          hidden: true,
          title: 'Сеть'
        }
      }
    ] as RouteRecord[])
  }
  // End Breadcrumbs
}
</script>
