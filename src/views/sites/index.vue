<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="loadSites"
      widthStorageNamePrefix='sites'
      ref='sitestable'
    )
      template(v-slot:oper="{row}")
        el-button(
          icon="el-icon-edit" size="mini"
          @click="openEdit(row)"
          :disabled="!$perms.is_superuser"
        )
      el-button(
        size='mini'
        icon='el-icon-plus'
        @click='openNew'
      ) Добавить домен

    el-dialog(
      :title="dialogTitle"
      :visible.sync="dialogVisible"
    )
      site-form(
        v-on:done="frmDone"
      )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { SiteModule } from '@/store/modules/sites/index'
import { ISite } from '@/api/sites/types'
import { getSites } from '@/api/sites/req'
import SiteForm from './site-form.vue'
import { IDRFRequestListParameters } from '@/api/types'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import { RouteRecord } from 'vue-router'

class DataTableComp extends DataTable<ISite> {}

@Component({
  name: 'SiteIndex',
  components: {
    'datatable': DataTableComp,
    SiteForm
  }
})
export default class extends Vue {
  public readonly $refs!: {
    sitestable: DataTableComp
  }
  private dialogVisible = false

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'id',
      label: 'ID',
      'min-width': 70
    },
    {
      prop: 'domain',
      label: 'Домен',
      sortable: true,
      'min-width': 250
    },
    {
      prop: 'name',
      label: 'Название',
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

  get dialogTitle() {
    let t = 'Изменить'
    if (SiteModule.id === 0) {
      t = 'Создать'
    }
    return `${t} домен`
  }

  private loadSites(params?: IDRFRequestListParameters) {
    if (params) {
      params['fields'] = 'id,name,domain'
    }
    return getSites(params)
  }

  private async openEdit(site: ISite) {
    await SiteModule.SET_ALL_SITE(site)
    this.dialogVisible = true
  }
  private async openNew() {
    await SiteModule.RESET_ALL_SITE()
    this.dialogVisible = true
  }

  private frmDone() {
    this.dialogVisible = false
    this.$refs.sitestable.GetTableData()
  }

  // Breadcrumbs
  created() {
    document.title = 'Сайты'
    BreadcrumbsModule.SetCrumbs([
      {
        path: '/',
        meta: {
          hidden: true,
          title: 'Сайты'
        }
      }
    ] as RouteRecord[])
  }
  // End Breadcrumbs
}
</script>
