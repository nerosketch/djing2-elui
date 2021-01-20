<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="loadAddrs"
      widthStorageNamePrefix='addrs'
      ref='addrtable'
    )
      template(v-slot:oper="{row}")
        el-button(
          icon="el-icon-edit" size="mini"
          @click="openEdit(row)"
        )
      el-button(
        size='mini'
        icon='el-icon-plus'
        @click='openNew'
      ) Добавить адресный объект

    el-dialog(
      title="Адресный объект"
      :visible.sync="dialogVisible"
    )
      addr-form(
        v-on:done="frmDone"
      )
</template>

<script lang="ts">
import { getAddrs } from '@/api/sorm/req'
import { IFiasRecursiveAddress } from '@/api/sorm/types'
import { IDRFRequestListParameters } from '@/api/types'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { FiasRecursiveAddressModule } from '@/store/modules/sorm'
import { Component, Vue } from 'vue-property-decorator'
import AddrForm from './addr-form.vue'

class DataTableComp extends DataTable<IFiasRecursiveAddress> {}

@Component({
  name: 'AddrList',
  components: {
    'datatable': DataTableComp,
    AddrForm
  }
})
export default class extends Vue {
  public readonly $refs!: {
    addrtable: DataTableComp
  }

  private dialogVisible = false

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
      'min-width': 250
    },
    {
      prop: 'ao_level_name',
      label: 'Уровень адресного объекта',
      sortable: true,
      'min-width': 250
    },
    {
      prop: 'ao_type_name',
      label: 'Тип адресного объекта',
      sortable: true,
      'min-width': 250
    },
    {
      prop: 'oper',
      label: 'Кнопки',
      'min-width': 130,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private loadAddrs(params?: IDRFRequestListParameters) {
    if (params) {
      params['fields'] = 'id,title,ao_level_name,ao_type_name'
    }
    return getAddrs(params)
  }

  private openEdit(addr: IFiasRecursiveAddress) {
    FiasRecursiveAddressModule.SET_ALL_RECURSIVE_ADDRESS(addr)
    this.dialogVisible = true
  }

  private openNew() {
    FiasRecursiveAddressModule.RESET_ALL_RECURSIVE_ADDRESS()
    this.dialogVisible = true
  }

  private frmDone() {
    this.dialogVisible = false
    this.$refs.addrtable.GetTableData()
  }
}
</script>
