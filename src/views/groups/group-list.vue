<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="loadGroups"
      ref='table'
    )
      template(v-slot:pk="{row}") {{ row.pk }}

      template(v-slot:title="{row}") {{ row.title }}

      template(v-slot:code="{row}") {{ row.code }}

      template(v-slot:oper="{row}")
        el-button-group
          el-button(icon="el-icon-edit" size="mini" @click="openEdit(row)")
          el-button(type="danger" icon="el-icon-delete" size="mini" @click="delGroup(row)")

      el-button(
        size='mini'
        icon='el-icon-plus'
        @click='openNew'
      ) Добавить группу

    el-dialog(
      :title="dialogTitle"
      :visible.sync="dialogVisible"
    )
      group-form(
        v-on:done="frmDone"
      )

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { GroupModule } from '@/store/modules/groups/index'
import { IDRFRequestListParameters } from '@/api/types'
import { getGroups } from '@/api/groups/req'
import { IGroup } from '@/api/groups/types'
import GroupForm from './group-form.vue'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'

class DataTableComp extends DataTable<IGroup> {}

@Component({
  name: 'GroupList',
  components: {
    GroupForm,
    'datatable': DataTableComp
  }
})
export default class extends Vue {
  public readonly $refs!: {
    table: DataTableComp
  }
  private groups: IGroup[] = []
  private dialogVisible = false
  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'pk',
      label: 'ID',
      width: 70
    },
    {
      prop: 'title',
      label: 'Название',
      sortable: true
    },
    {
      prop: 'code',
      label: 'Тех.код',
      sortable: true
    },
    {
      prop: 'oper',
      label: 'Oper',
      width: 130,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private async openEdit(group: IGroup) {
    await GroupModule.SET_ALL_MGROUP(group)
    this.dialogVisible = true
  }
  private async openNew() {
    await GroupModule.RESET_ALL_MGROUP()
    this.dialogVisible = true
  }

  get dialogTitle() {
    let t = 'Изменить'
    if (GroupModule.pk === 0) {
      t = 'Создать'
    }
    return `${t} группу`
  }

  private async loadGroups(params?: IDRFRequestListParameters) {
    if (params) {
      params['fields'] = 'pk,title,code'
    }
    const r = await getGroups(params)
    this.groups = r.data.results
    return r
  }

  private delGroup(group: IGroup) {
    this.$confirm(`Ты действительно хочешь удалить группу "${group.title}"?`).then(async() => {
      await GroupModule.DelGroup(group.pk)
      this.$message.success(`Группа "${group.title}" удалена`)
      this.$refs.table.GetTableData()
    })
  }

  private frmDone() {
    this.dialogVisible = false
    this.$message.success('Группа сохранена')
    this.$refs.table.GetTableData()
  }
}
</script>
