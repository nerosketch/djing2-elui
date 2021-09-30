<template lang="pug">
.app-container
  el-row(:gutter="10")
    el-col.col_vert_space
      span Тип: &nbsp;
      address-type-choice(
        v-model="filterAddressTypeValue"
        :style="{ width: '200px' }"
      )
    el-col
      datatable(
        :columns="tableColumns"
        :getData="loadAddresses"
        widthStorageNamePrefix='addrs'
        :heightDiff='148'
        ref='addrtbl'
      )
        template(v-slot:oper="{row}")
          el-button-group
            el-button(
              v-show="row.address_type === 4"
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
      :addrId="$store.state.address.id"
      @done="streetDialogVisible=false"
    )

</template>

<script lang="ts">
import { getAddresses } from '@/api/addresses/req'
import { IAddressEnumTypes, IAddressModel } from '@/api/addresses/types'
import { IDRFRequestListParameters } from '@/api/types'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { AddressModule } from '@/store/modules/addresses/address'
import { Component, Vue, Watch } from 'vue-property-decorator'
import AddressForm from './addr-form.vue'
import StreetEditor from './street-editor.vue'
import AddressTypeChoice from '@/components/Address/type-choice.vue'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'

class DataTableComp extends DataTable<IAddressModel> {}

@Component({
  name: 'Addresses',
  components: {
    datatable: DataTableComp,
    AddressForm,
    StreetEditor,
    AddressTypeChoice
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
      label: 'Название'
    },
    {
      prop: 'parent_addr_title',
      label: 'Родительский адрес',
      'min-width': 80
    },
    {
      prop: 'fias_address_level_name',
      label: 'Уровень ФИАС',
      'min-width': 65
    },
    {
      prop: 'fias_address_type_name',
      label: 'Тип адреса ФИАС',
      'min-width': 70
    },
    {
      prop: 'oper',
      label: 'Кнопки',
      width: 195,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private filterAddressTypeValue = IAddressEnumTypes.LOCALITY

  private loadAddresses(params?: IDRFRequestListParameters) {
    if (params) {
      params = Object.assign(params, {
        fields: 'id,title,address_type,parent_addr,parent_addr_title,fias_address_level_name,fias_address_type_name',
        address_type: this.filterAddressTypeValue || null
      })
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

  @Watch('filterAddressTypeValue')
  private onChAddrTypeFilter() {
    this.$refs.addrtbl.LoadTableData()
  }

  // Breadcrumbs
  created() {
    BreadcrumbsModule.SetCrumbs([
      {
        meta: {
          hidden: true,
          title: 'Адреса'
        }
      }
    ] as any[])
  }
  // End Breadcrumbs
}
</script>
