<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="loadAddresses"
      widthStorageNamePrefix='addrs'
      ref='addrtbl'
    )
      template(v-slot:oper="{row}")
        el-button-group
          el-button(
            icon='el-icon-c-scale-to-original'
            @click="openStreetEditor(row)"
          )
          el-button(
            icon="el-icon-edit"
            @click="openEdit(row)"
            :disabled="!$perms.addresses.change_addressmodel"
          )
          el-button(
            type="danger" icon="el-icon-delete"
            @click="delAddress(row)"
            :disabled="!$perms.addresses.delete_addressmodel"
          )
      el-button(
        icon='el-icon-plus'
        @click='openNew'
        :disabled="!$perms.addresses.add_addressmodel"
      ) Добавить адресный объект

    el-dialog(
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    )
      address-form(
        v-on:done="frmDone"
      )

    el-dialog(
      :title="changeStreetTitle"
      :visible.sync="streetDialogVisible"
      :close-on-click-modal="false"
    )
      street-editor(
        :localityId="$store.state.address.id"
        @done="streetDialogVisible=false"
      )

</template>

<script lang="ts">
import { getAddresses } from '@/api/addresses/req'
import { IAddressModel } from '@/api/addresses/types'
import { IDRFRequestListParameters } from '@/api/types'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { AddressModule } from '@/store/modules/addresses/address'
import { Component, Vue } from 'vue-property-decorator'
import AddressForm from './addr-form.vue'
import StreetEditor from './street-editor.vue'

class DataTableComp extends DataTable<IAddressModel> {}

@Component({
  name: 'Addresses',
  components: {
    datatable: DataTableComp,
    AddressForm,
    StreetEditor
  }
})
export default class extends Vue {
  public readonly $refs!: {
    addrtbl: DataTableComp
  }

  private dialogVisible = false
  private streetDialogVisible = false

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'title',
      label: 'Название',
    },
    {
      prop: 'oper',
      label: 'Кнопки',
      'min-width': 195,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private loadAddresses(params?: IDRFRequestListParameters) {
    if (params) {
      params.fields = 'id,title'
    }
    return getAddresses(params)
  }

  get dialogTitle() {
    let t = 'Изменить'
    if (this.$store.state.address.id === 0) {
      t = 'Создать'
    }
    return `${t} адресный объект`
  }

  private frmDone() {
    this.dialogVisible = false
    this.$message.success('адресный объект сохранён')
    this.$refs.addrtbl.LoadTableData()
  }

  private async openEdit(loc: IAddressModel) {
    await AddressModule.SET_ALL_ADDR(loc)
    this.dialogVisible = true
  }

  private async openNew() {
    await AddressModule.RESET_ALL_ADDR()
    this.dialogVisible = true
  }

  private delAddress(loc: IAddressModel) {
    this.$confirm(`Действительно удалить адресный объект "${loc.title}"?`).then(async() => {
      await AddressModule.DelAddress(loc.id)
      this.$message.success(`Адресный объект "${loc.title}" удалён`)
      this.$refs.addrtbl.LoadTableData()
    })
  }

  private async openStreetEditor(loc: IAddressModel) {
    await AddressModule.SET_ALL_ADDR(loc)
    this.streetDialogVisible = true
  }

  private get changeStreetTitle() {
    return `Изменить улицы для "${this.$store.state.address.title}"`
  }
}
</script>
