<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="loadAddrs"
      widthStorageNamePrefix='addrs'
      ref='addrtable'
    )
      template(v-slot:oper="{row}")
        el-button-group
          el-button(
            icon="el-icon-edit"
            @click="openEdit(row)"
          ) Изменить
          el-button(
            icon='el-icon-remove'
            type='danger'
            @click="delIt(row)"
          ) Удалить
      el-button(
        icon='el-icon-plus'
        @click='openNew'
      ) Добавить адресный объект

    el-dialog(
      title="Адресный объект"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    )
      addr-form(
        v-on:done="frmDone"
        :addrsList="loadedDataList"
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
    datatable: DataTableComp,
    AddrForm
  }
})
export default class extends Vue {
  public readonly $refs!: {
    addrtable: DataTableComp
  }

  private dialogVisible = false
  private loadedDataList: IFiasRecursiveAddress[] = []

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'ao_type_name',
      label: 'Тип адресного объекта',
      'min-width': 250
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
      'min-width': 250
    },
    {
      prop: 'locality_title',
      label: 'Населённый пункт'
    },
    {
      prop: 'parent_ao_name',
      label: 'Родительский объект'
    },
    {
      prop: 'oper',
      label: 'Кнопки',
      'min-width': 130,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private async loadAddrs(params?: IDRFRequestListParameters) {
    if (params) {
      params.fields = 'id,title,ao_level_name,ao_type_name,parent_ao,locality,locality_title,parent_ao_name'
    }
    const r = await getAddrs(params)
    this.loadedDataList = r.data.results
    return r
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

  private delIt(addr: IFiasRecursiveAddress) {
    this.$confirm('Все дочерние объекты потеряют родителя.', 'Удалить адресный объект?').then(async() => {
      await FiasRecursiveAddressModule.DelAddress(addr.id)
      this.$refs.addrtable.GetTableData()
      this.$message.success('Адресный объект успешно удалён.')
    })
  }
}
</script>
