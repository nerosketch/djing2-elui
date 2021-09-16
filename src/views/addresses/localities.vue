<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="loadLocalities"
      widthStorageNamePrefix='localities'
      ref='loctable'
    )
      template(v-slot:oper="{row}")
        el-button-group
          el-button(
            icon="el-icon-edit"
            @click="openEdit(row)"
            :disabled="!$perms.addresses.change_localitymodel"
          )
          el-button(
            type="danger" icon="el-icon-delete"
            @click="delLocality(row)"
            :disabled="!$perms.addresses.delete_localitymodel"
          )
      el-button(
        icon='el-icon-plus'
        @click='openNew'
        :disabled="!$perms.addresses.add_localitymodel"
      ) Добавить населённый пункт

    el-dialog(
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    )
      locality-form(
        v-on:done="frmDone"
      )
</template>

<script lang="ts">
import { getLocalities } from '@/api/addresses/req'
import { ILocalityModel } from '@/api/addresses/types'
import { IDRFRequestListParameters } from '@/api/types'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { LocalityModule } from '@/store/modules/addresses/locality'
import { Component, Vue } from 'vue-property-decorator'
import LocalityForm from './locality-form.vue'

class DataTableComp extends DataTable<ILocalityModel> {}

@Component({
  name: 'Localities',
  components: {
    'datatable': DataTableComp,
    LocalityForm,
  }
})
export default class extends Vue {
  public readonly $refs!: {
    loctable: DataTableComp
  }
  private dialogVisible = false

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'title',
      label: 'Название',
      sortable: true,
      'min-width': 250
    },
    {
      prop: 'oper',
      label: 'Кнопки',
      'min-width': 195,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private loadLocalities(params?: IDRFRequestListParameters) {
    return getLocalities(params)
  }

  get dialogTitle() {
    let t = 'Изменить'
    if (this.$store.state.locality.id === 0) {
      t = 'Создать'
    }
    return `${t} населённый пункт`
  }

  private frmDone() {
    this.dialogVisible = false
    this.$message.success('Населённый пункт сохранён')
    this.$refs.loctable.GetTableData()
  }

  private async openEdit(loc: ILocalityModel) {
    await LocalityModule.SET_ALL_LOCALITY(loc)
    this.dialogVisible = true
  }
  private async openNew() {
    await LocalityModule.RESET_ALL_LOCALITY()
    this.dialogVisible = true
  }

  private delLocality(loc: ILocalityModel) {
    this.$confirm(`Действительно удалить населённый пункт "${loc.title}"?`).then(async() => {
      await LocalityModule.DelLocality(loc.id)
      this.$message.success(`Населённый пункт "${loc.title}" удалён`)
      this.$refs.loctable.GetTableData()
    })
  }
}
</script>
