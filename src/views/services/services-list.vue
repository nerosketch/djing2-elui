<template lang="pug">
div
  datatable(
    :columns="tableColumns"
    :getData="loadServices"
    :heightDiff='165'
    widthStorageNamePrefix='services'
    ref='table'
  )
    template(v-slot:isadm="{row}")
      el-checkbox(v-model="row.is_admin" disabled) {{ row.is_admin ? 'Да' : 'Нет'}}

    template(v-slot:oper="{row}")
      el-button-group
        el-button(size='mini' icon='el-icon-lock' @click="openPermsDialog(row)" v-if="$perms.is_superuser")
        el-button(icon="el-icon-edit" size="mini" @click="openEdit(row)")
        el-button(
          type="danger" icon="el-icon-delete" size="mini"
          @click="delSrv(row)"
          :disabled="!$perms.services.delete_service"
        )

    el-button(
      size='mini'
      icon='el-icon-plus'
      type='success'
      @click="openNew"
      :disabled="!$perms.services.add_service"
    ) Добавить

  el-dialog(
    :title="(isNew ? 'Создание' : 'Изменение') + ' услуги'"
    :visible.sync="dialogVisible"
  )
    service-form(
      v-on:done="frmDone"
    )
  el-dialog(
    title="Кто имеет права на услугу"
    :visible.sync="permsDialog"
    top="5vh"
  )
    object-perms(
      v-on:save="changeSrvObjectPerms"
      :getGroupObjectPermsFunc="getSrvObjectPermsFunc4Grp"
      :getSelectedObjectPerms="serviceGetSelectedObjectPerms"
      :objId="srvIdGetter"
    )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { RouteRecord } from 'vue-router'
import { IObjectGroupPermsResultStruct, IObjectGroupPermsInitialAxiosResponsePromise } from '@/api/types'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { IService, IDRFRequestListParametersService } from '@/api/services/types'
import { getServices, setServiceObjectsPerms, getServiceObjectsPerms, getServiceOSelectedObjectPerms } from '@/api/services/req'
import { ServiceModule } from '@/store/modules/services/service'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import ServiceForm from './service-form.vue'

class DataTableComp extends DataTable<IService> {}

@Component({
  name: 'ServiceList',
  components: { 'datatable': DataTableComp, ServiceForm }
})
export default class extends Vue {
  public readonly $refs!: {
    table: DataTableComp
  }
  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'pk',
      label: 'ID',
      'min-width': 50,
      align: DataTableColumnAlign.CENTER
    },
    {
      prop: 'title',
      label: 'Название',
      sortable: true,
      'min-width': 200
    },
    {
      prop: 'descr',
      label: 'Описание',
      'min-width': 300
    },
    {
      prop: 'speed_in',
      label: 'Вход.ск.',
      'min-width': 110,
      sortable: true
    },
    {
      prop: 'speed_out',
      label: 'Исход.ск.',
      'min-width': 110,
      sortable: true
    },
    {
      prop: 'speed_burst',
      label: 'Бурст',
      'min-width': 100
    },
    {
      prop: 'cost',
      label: 'Цена',
      'min-width': 90,
      sortable: true
    },
    {
      prop: 'isadm',
      label: 'Админ.',
      'min-width': 80,
      align: DataTableColumnAlign.CENTER
    },
    {
      prop: 'usercount',
      label: 'Кол.польз.',
      'min-width': 130,
      sortable: true,
      align: DataTableColumnAlign.CENTER
    },
    {
      prop: 'oper',
      label: 'Oper',
      'min-width': 130,
      align: DataTableColumnAlign.CENTER
    }
  ]
  private services: IService[] = []
  private dialogVisible = false
  private permsDialog = false

  private async openEdit(srv: IService) {
    await ServiceModule.SET_ALL_SERVICE(srv)
    this.dialogVisible = true
  }

  private openNew() {
    ServiceModule.RESET_ALL_SERVICE()
    this.dialogVisible = true
  }

  private async delSrv(srv: IService) {
    if (confirm(`Действительно удалить услугу "${srv.title}"?`)) {
      await ServiceModule.DelService(srv.pk)
      this.$message.success('Услуга удалена')
      this.$refs.table.GetTableData()
    }
  }

  private loadServices(params?: IDRFRequestListParametersService) {
    if (params) {
      params['fields'] = 'pk,title,descr,speed_in,speed_out,speed_burst,cost,is_admin,usercount,calc_type'
    }
    return getServices(params)
  }

  private frmDone() {
    this.dialogVisible = false
    this.$refs.table.GetTableData()
  }

  get isNew(): boolean {
    return this.srvIdGetter === 0
  }

  get srvIdGetter() {
    return ServiceModule.pk
  }
  private openPermsDialog(s: IService) {
    ServiceModule.SET_ALL_SERVICE(s)
    this.permsDialog = true
  }
  private async changeSrvObjectPerms(info: IObjectGroupPermsResultStruct) {
    await setServiceObjectsPerms(this.srvIdGetter, info)
    this.permsDialog = false
  }
  private getSrvObjectPermsFunc4Grp(): IObjectGroupPermsInitialAxiosResponsePromise {
    return getServiceObjectsPerms(this.srvIdGetter)
  }
  private serviceGetSelectedObjectPerms(srvId: number, profileGroupId: number) {
    return getServiceOSelectedObjectPerms(srvId, profileGroupId)
  }

  // Breadcrumbs
  created() {
    BreadcrumbsModule.SetCrumbs([
      {
        path: '/',
        meta: {
          hidden: true,
          title: 'Тарифы'
        }
      }
    ] as RouteRecord[])
  }
  // End Breadcrumbs
}
</script>
