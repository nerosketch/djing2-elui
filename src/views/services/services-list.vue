<template lang="pug">
div
  datatable(
    :columns="tableColumns"
    :getData="loadServices"
    :loading="loading"
    ref='table'
  )
    span(slot="id" slot-scope="{row}") {{ row.pk }}
    span(slot="title" slot-scope="{row}") {{ row.title }}
    span(slot="descr" slot-scope="{row}") {{ row.descr }}
    span(slot="speed_in" slot-scope="{row}") {{ row.speed_in }}
    span(slot="speed_out" slot-scope="{row}") {{ row.speed_out }}
    span(slot="speed_burst" slot-scope="{row}") {{ row.speed_burst }}
    span(slot="cost" slot-scope="{row}") {{ row.cost }}
    el-checkbox(v-model="row.is_admin" slot="isadm" slot-scope="{row}" disabled) {{ row.is_admin ? 'Да' : 'Нет'}}
    span(slot="usercount" slot-scope="{row}") {{ row.usercount }}
    el-button-group(slot="oper" slot-scope="{row}")
      el-button(icon="el-icon-edit" size="mini" @click="openEdit(row)")
      el-button(type="danger" icon="el-icon-delete" size="mini" @click="delSrv(row)")

  el-dialog(
    title="Изменение Услуги"
    :visible.sync="dialogVisible"
  )
    service-form(
      v-on:done="frmDone"
    )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { IDRFRequestListParameters } from '@/api/types'
import { IService, IDRFRequestListParametersService } from '@/api/services/types'
import { getServices } from '@/api/services/req'
import { ServiceModule } from '@/store/modules/services/service'
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
      prop: 'id',
      label: 'ID',
      width: 50,
      align: DataTableColumnAlign.CENTER
    },
    {
      prop: 'title',
      label: 'Название',
      sortable: true
    },
    {
      prop: 'descr',
      label: 'Описание'
    },
    {
      prop: 'speed_in',
      label: 'Вход.ск.',
      width: 90,
      sortable: true
    },
    {
      prop: 'speed_out',
      label: 'Исход.ск.',
      width: 90,
      sortable: true
    },
    {
      prop: 'speed_burst',
      label: 'Бурст',
      width: 90
    },
    {
      prop: 'cost',
      label: 'Цена',
      width: 90,
      sortable: true
    },
    {
      prop: 'isadm',
      label: 'Админ.',
      width: 80,
      align: DataTableColumnAlign.CENTER
    },
    {
      prop: 'usercount',
      label: 'Кол.польз.',
      width: 100,
      sortable: true
    },
    {
      prop: 'oper',
      label: 'Oper',
      width: 130,
      align: DataTableColumnAlign.CENTER
    }
  ]
  private services: IService[] = []
  private dialogVisible = false
  private loading = false

  private async openEdit(srv: IService) {
    await ServiceModule.SET_ALL_SERVICE(srv)
    this.dialogVisible = true
  }

  private async delSrv(srv: IService) {
    if (confirm(`Ты действительно хочешь удалить услугу "${srv.title}"?`)) {
      await ServiceModule.DelService(srv.pk)
      this.$refs.table.GetTableData()
    }
  }

  private async loadServices(params?: IDRFRequestListParametersService) {
    this.loading = true
    if (params) {
      params['fields'] = 'pk,title,descr,speed_in,speed_out,speed_burst,cost,is_admin,usercount,calc_type'
    }
    const r = await getServices(params)
    this.loading = false
    return r
  }

  private frmDone() {
    this.dialogVisible = false
    this.$refs.table.GetTableData()
  }
}
</script>
