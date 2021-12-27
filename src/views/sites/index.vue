<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="loadSites"
      widthStorageNamePrefix="sites"
      ref="sitestable")
      template(v-slot:oper="{row}")
        el-button(
          icon="el-icon-edit"
          @click="openEdit(row)"
          :disabled="!$perms.is_superuser")
    
      el-button(icon="el-icon-plus", @click="openNew")
        | {{ $t('addDomain') }}
  
    el-dialog(
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false")
      site-form(v-on:done="frmDone")
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

class DataTableComp extends DataTable<ISite> {}

@Component({
  name: 'SiteIndex',
  components: {
    datatable: DataTableComp,
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
      label: this.$t('domain'),
      sortable: true,
      'min-width': 250
    },
    {
      prop: 'name',
      label: this.$t('title'),
      sortable: true,
      'min-width': 250
    },
    {
      prop: 'op',
      label: this.$t('buttons'),
      'min-width': 130,
      align: DataTableColumnAlign.CENTER
    }
  ]

  get dialogTitle() {
    let t
    if (SiteModule.id === 0) {
      t = this.$t('add').toString()
    } else {
      t = this.$t('change').toString()
    }
    return this.$t('sites.addDomain')
  }

  private loadSites(params?: IDRFRequestListParameters) {
    if (params) {
      params.fields = 'id,name,domain'
    }
    return getSites(params)
  }

  private openEdit(site: ISite) {
    SiteModule.SET_ALL_SITE(site)
    this.dialogVisible = true
  }

  private openNew() {
    SiteModule.RESET_ALL_SITE()
    this.dialogVisible = true
  }

  private frmDone() {
    this.dialogVisible = false
    this.$refs.sitestable.LoadTableData()
  }

  // Breadcrumbs
  created() {
    document.title = this.$t('sites.site')
    BreadcrumbsModule.SetCrumbs([
      {
        path: '/',
        meta: {
          hidden: true,
          title: this.$t('sites.site')
        }
      }
    ] as any)
  }
  // End Breadcrumbs
}
</script>
