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
            v-if="$perms.is_superuser"
            @click="openSitesDlg(row)"
          ) C
          el-button(
            icon='el-icon-c-scale-to-original'
            @click="openStreetEditor(row)"
          )
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

    el-dialog(
      :title="changeStreetTitle"
      :visible.sync="streetDialogVisible"
      :close-on-click-modal="false"
    )
      street-editor(
        :localityId="$store.state.locality.id"
        @done="streetDialogVisible=false"
      )

    el-dialog(
      title="Принадлежность сайтам"
      :visible.sync="sitesDlg"
      :close-on-click-modal="false"
    )
      sites-attach(
        v-on:save="localitySitesSave"
        :selectedSiteIds="$store.state.locality.sites"
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
import StreetEditor from './street-editor.vue'

class DataTableComp extends DataTable<ILocalityModel> {}

@Component({
  name: 'Localities',
  components: {
    datatable: DataTableComp,
    LocalityForm,
    StreetEditor
  }
})
export default class extends Vue {
  public readonly $refs!: {
    loctable: DataTableComp
  }

  private dialogVisible = false
  private streetDialogVisible = false
  private sitesDlg = false

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
    if (params) {
      params.fields = 'id,title'
    }
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

  private async openStreetEditor(loc: ILocalityModel) {
    await LocalityModule.SET_ALL_LOCALITY(loc)
    this.streetDialogVisible = true
  }

  private get changeStreetTitle() {
    return `Изменить улицы для "${this.$store.state.locality.title}"`
  }

  private async openSitesDlg(loc: ILocalityModel) {
    await LocalityModule.GetLocality(loc.id)
    this.sitesDlg = true
  }

  private localitySitesSave(selectedSiteIds: number[]) {
    LocalityModule.PatchLocality({
      sites: selectedSiteIds
    }).then(() => {
      this.$refs.loctable.GetTableData()
      this.$message.success('Принадлежность населённого пункта сайтам сохранена')
    })
    this.sitesDlg = false
  }
}
</script>
