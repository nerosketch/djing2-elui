<template lang="pug">
  div
    datatable(
      :columns="tableColumns"
      :getData="loadVlans"
      :heightDiff="188"
      :editFieldsVisible.sync="editFieldsVisible"
      widthStorageNamePrefix="vlans"
      ref="table")
      template(v-slot:ismng="{row}")
        boolean-icon(v-model="row.is_management")
          | {{ $t('and-nbsp-row-is_management-da-net', [row.is_management ? 'Да' : 'Нет']) }}
    
      template(v-slot:oper="{row}")
        el-button-group
          el-button(v-if="$perms.is_superuser", @click="openSitesDlg(row)")
            | C
        
          el-button(
            icon="el-icon-edit"
            @click="openEdit(row)"
            :disabled="!$perms.networks.change_vlanif")
        
          el-button(
            type="danger"
            icon="el-icon-delete"
            @click="delVlan(row)"
            :disabled="!$perms.networks.delete_vlanif")
    
      el-button-group
        el-button(
          icon="el-icon-plus"
          @click="openNew"
          :disabled="!$perms.networks.add_vlanif")
          | {{ $t('add') }}
      
        el-button(icon="el-icon-s-operation", @click="editFieldsVisible=true")
          | {{ $t('polya-1') }}
  
    el-dialog(
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false")
      vlan-form(v-on:done="frmDone")
  
    el-dialog(
      title="$t('prinadlezhnost-saitam-2')"
      :visible.sync="sitesDlg"
      :close-on-click-modal="false")
      sites-attach(:selectedSiteIds="$store.state.vlan.sites", v-on:save="vlanSitesSave")
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { IVlanIf } from '@/api/networks/types'
import { VlanIfModule } from '@/store/modules/networks/vlan'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import VlanForm from './vlan-form.vue'
import VlanMixin from './vlan-mixin'
import BooleanIcon from '@/components/boolean-icon.vue'

class DataTableComp extends DataTable<IVlanIf> {}

@Component({
  name: 'VlanList',
  components: {
    datatable: DataTableComp,
    VlanForm,
    BooleanIcon
  }
})
export default class extends mixins(VlanMixin) {
  public readonly $refs!: {
    table: DataTableComp
  }

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'title',
      label: this.$t('nazvanie-5'),
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
      label: this.$t('upravl'),
      'min-width': 80,
      align: DataTableColumnAlign.CENTER
    },
    {
      prop: 'oper',
      label: this.$t('knopki-4'),
      'min-width': 130,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private dialogVisible = false
  private sitesDlg = false
  private editFieldsVisible = false

  get dialogTitle() {
    let w = this.$t('izmenenie')
    if (VlanIfModule.id === 0) {
      w = this.$t('dobavlenie')
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
    this.$confirm({{ $t('deistvitelno-udalit-vlan-vlan-title', [vlan.title]) }}).then(async() => {
      await VlanIfModule.DelVlan(vlan.id)
      this.$message.success(this.$t('vlan-udalyon'))
      this.$refs.table.LoadTableData()
    })
  }

  private frmDone() {
    this.dialogVisible = false
    this.$refs.table.LoadTableData()
  }

  // Breadcrumbs
  created() {
    BreadcrumbsModule.SetCrumbs([
      {
        path: '/',
        meta: {
          hidden: true,
          title: this.$t('set')
        }
      }
    ] as any)
  }
  // End Breadcrumbs

  private vlanSitesSave(selectedSiteIds: number[]) {
    VlanIfModule.PatchVlan({
      sites: selectedSiteIds
    }).then(() => {
      this.$refs.table.LoadTableData()
      this.$message.success(this.$t('prinadlezhnost-vlan-saitam-sokhranena'))
    })
    this.sitesDlg = false
  }

  private openSitesDlg(vlan: IVlanIf) {
    VlanIfModule.SET_ALL_VLAN(vlan)
    this.sitesDlg = true
  }
}
</script>
