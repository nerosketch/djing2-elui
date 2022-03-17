<template lang="pug">
div
  datatable(
    :columns="tableColumns"
    :getData="loadModes"
    :heightDiff="188"
    widthStorageNamePrefix="modes"
    ref='tbl'
  )
    template(#btn="{ row }")
      el-button(
        @click="openChange(row)"
        icon='el-icon-view'
        circle
      )
    el-button(
      icon="el-icon-plus"
      @click="openNew"
    ) {{ $t('tasks.modes.title') }}

  el-dialog(
    :title="$t('tasks.modes.add')"
    :visible.sync="addDialogVisible"
    :close-on-click-modal="false"
  )
    mode-frm(
      @created="frmDone"
      @changed="frmDone"
    )
</template>

<script lang="ts">
import DataTable, { IDataTableColumn } from '@/components/Datatable/index.vue'
import { getModes } from '@/api/tasks/req'
import { ITaskMode } from '@/api/tasks/types'
import { IDRFRequestListParameters } from '@/api/types'
import { Component, Vue } from 'vue-property-decorator'
import ModeFrm from './mode-frm.vue'
import { TaskModeModule } from '@/store/modules/tasks/modes'

class DataTableComp extends DataTable<ITaskMode> {}

@Component({
  name: 'TaskModeList',
  components: {
    datatable: DataTableComp,
    ModeFrm
  }
})
export default class extends Vue {
  public readonly $refs!: {
    tbl: DataTableComp
  }
  private addDialogVisible = false

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'title',
      label: this.$tc('tasks.modes.title'),
    },
    {
      prop: 'btn',
      label: '-',
      width: 50
    }
  ]

  private loadModes(params?: IDRFRequestListParameters) {
    if (params) {
      params.fields = 'id,title'
    }
    return getModes(params)
  }

  private openNew() {
    TaskModeModule.RESET_ALL_TASK_MODE()
    this.addDialogVisible = true
  }

  private openChange(item: ITaskMode) {
    TaskModeModule.SET_ALL_TASK_MODE(item)
    this.addDialogVisible = true
  }

  private frmDone() {
    this.$refs.tbl.LoadTableData()
    this.addDialogVisible = false
  }
}
</script>
