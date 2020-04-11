<template lang="pug">
div
  datatable(
    :columns="tableColumns"
    :getData="loadTasks"
    :loading="loading"
    :tableRowClassName="tableRowClassName"
    ref='tbl'
  )
    span(slot="id" slot-scope="{row}") {{ row.id }}

    el-link(slot="customer_full_name" slot-scope="{row}" type="primary")
      router-link(:to="{name: 'customerDetails', params:{uid: row.customer }}") {{ row.customer_full_name }}

    span(slot="customer_address" slot-scope="{row}") {{ row.customer_address }}
    span(slot="mode_str" slot-scope="{row}") {{ row.mode_str }}
    span(slot="descr" slot-scope="{row}") {{ row.descr }}
    span(slot="state_str" slot-scope="{row}") {{ row.state_str }}
    span(slot="time_of_create" slot-scope="{row}") {{ row.time_of_create }}
    el-button-group(slot="oper" slot-scope="{row}")
      el-button(icon="el-icon-edit" size="mini")
      el-button(type="danger" icon="el-icon-delete" size="mini")

  el-button(
    type="success"
    icon="el-icon-plus"
    size='small'
  ) Добавить задачу
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { IDRFRequestListParameters } from '@/api/types'
import { ITask, ITaskPriority } from '@/api/tasks/types'
import { getTasks } from '@/api/tasks/req'

class DataTableComp extends DataTable<ITask> {}


@Component({
  name: 'TaskList',
  components: { 'datatable': DataTableComp }
})
export default class extends Vue {
  public readonly $refs!: {
    table: DataTableComp
  }

  @Prop({ default: '' })
  private tabUrl!: string

  @Watch('tabUrl')
  private onTabTypeChanged() {
    this.loadTasks()
  }

  private tableRowClassName(r: any) {
    if(r.row.is_expired === undefined) return
    if(!r.row.is_expired) {
      if(r.row.priority === ITaskPriority.LOW) {
        return 'success-row'
      } else if (r.row.priority === ITaskPriority.HIGHER) {
        return 'error-row'
      }
    }
  }

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'id',
      label: 'ID',
      width: 70
    },
    {
      prop: 'customer_full_name',
      label: 'Имя'
    },
    {
      prop: 'customer_address',
      label: 'Адрес',
      sortable: true
    },
    {
      prop: 'mode_str',
      label: 'Характер поломки',
      sortable: true
    },
    {
      prop: 'descr',
      label: 'Описание'
    },
    {
      prop: 'state_str',
      label: 'Состояние'
    },
    {
      prop: 'time_of_create',
      label: 'Дата создания'
    },
    {
      prop: 'oper',
      label: 'Действия',
      width: 130,
      align: DataTableColumnAlign.CENTER
    }
  ]
  private loading = false

  private async loadTasks(params?: IDRFRequestListParameters) {
    this.loading = true
    const r = await getTasks(params, this.tabUrl)
    this.loading = false
    return r
  }

  // private frmDone() {
  //   this.dialogVisible = false
  //   this.$refs['table'].GetTableData()
  //   this.loadLeases()
  // }
}
</script>
