<template lang="pug">
  datatable(
    :columns="tableColumns"
    :getData="loadTLog"
    :heightDiff="167"
    widthStorageNamePrefix="customerTaskHistory"
    ref="tlogtbl")
    template(#viewbtn="{row}")
      router-link(:to="{name: 'taskDetails', params: { taskId: row.id }}")
        el-button(:type="row.comment_count > 0 ? 'success' : 'primary'")
          template(v-if="row.comment_count > 0")
            | {{ row.comment_count }}

          i.el-icon-view(v-else)
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { getTasks } from '@/api/tasks/req'
import { CustomerModule } from '@/store/modules/customers/customer'
import { IDRFRequestListParameters } from '@/api/types'
import { ITask } from '@/api/tasks/types'

class DataTableComp extends DataTable<ITask> {}

@Component({
  name: 'CustomerTaskHistory',
  components: {
    datatable: DataTableComp
  }
})
export default class extends Vue {
  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'viewbtn',
      label: '#',
      'min-width': 80,
      align: DataTableColumnAlign.CENTER
    },
    {
      prop: 'author_uname',
      label: this.$tc('customers.author'),
      'min-width': 100
    },
    {
      prop: 'descr',
      label: this.$tc('comment'),
      'min-width': 250
    },
    {
      prop: 'state_str',
      label: this.$tc('customers.state'),
      'min-width': 200
    },
    {
      prop: 'mode_str',
      label: this.$tc('customers.type'),
      'min-width': 150
    },
    {
      prop: 'time_of_create',
      label: this.$tc('startDate'),
      'min-width': 200
    }
  ]

  private async loadTLog(params?: IDRFRequestListParameters) {
    let r
    if (params) {
      const newParams = Object.assign({
        customer: CustomerModule.id,
        fields: 'id,author_uname,descr,state_str,mode_str,time_of_create,comment_count'
      }, params)
      r = await getTasks(newParams)
    } else {
      r = await getTasks()
    }
    return r
  }
}
</script>
