<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="loadGroups"
      widthStorageNamePrefix='groups'
      ref='table'
    )
      template(v-slot:oper="{row}")
        el-button-group
          el-button(
            icon='el-icon-lock' size='mini'
            @click="openPermsDialog(row)"
            v-if="$perms.is_superuser"
          )
          el-button(
            icon="el-icon-edit" size="mini"
            @click="openEdit(row)"
            :disabled="!$perms.groupapp.change_group"
          )
          el-button(
            type="danger" icon="el-icon-delete" size="mini"
            @click="delGroup(row)"
            :disabled="!$perms.groupapp.delete_group"
          )

      el-button(
        size='mini'
        icon='el-icon-plus'
        @click='openNew'
        :disabled="!$perms.groupapp.add_group"
      ) Добавить группу

    el-dialog(
      :title="dialogTitle"
      :visible.sync="dialogVisible"
    )
      group-form(
        v-on:done="frmDone"
      )

    el-dialog(
      :title="`Кто имеет права на группу абонентов \"${GroupTitleGetter}\"`"
      :visible.sync="permsDialog"
      top="5vh"
    )
      object-perms(
        v-on:save="changeGroupObjectPerms"
        :getGroupObjectPermsFunc="getGroupObjectPermsFunc4Grp"
        :objId="groupIdGetter"
      )

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { GroupModule } from '@/store/modules/groups/index'
import { IDRFRequestListParameters, IObjectGroupPermsResultStruct, IObjectGroupPermsInitialAxiosResponsePromise } from '@/api/types'
import { getGroups, setObjectsPerms, getObjectsPerms } from '@/api/groups/req'
import { IGroup } from '@/api/groups/types'
import GroupForm from './group-form.vue'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import { RouteRecord } from 'vue-router'

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
  private permsDialog = false

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'pk',
      label: 'ID',
      'min-width': 70
    },
    {
      prop: 'title',
      label: 'Название',
      sortable: true,
      'min-width': 250
    },
    {
      prop: 'code',
      label: 'Тех.код',
      sortable: true,
      'min-width': 100
    },
    {
      prop: 'oper',
      label: 'Oper',
      'min-width': 130,
      align: DataTableColumnAlign.CENTER
    }
  ]

  get GroupTitleGetter() {
    return GroupModule.title
  }

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
    if (this.groupIdGetter === 0) {
      t = 'Создать'
    }
    return `${t} группу`
  }

  get groupIdGetter() {
    return GroupModule.pk
  }

  private async loadGroups(params?: IDRFRequestListParameters) {
    if (params) {
      params['fields'] = 'pk,title,code'
    }
    try {
      const r = await getGroups(params)
      this.groups = r.data.results
      return r
    } catch (err) {
      this.$message.error(err)
    }
    return null
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

  // Breadcrumbs
  created() {
    BreadcrumbsModule.SetCrumbs([
      {
        path: '/',
        meta: {
          hidden: true,
          title: 'Группы'
        }
      }
    ] as RouteRecord[])
  }
  // End Breadcrumbs

  private async changeGroupObjectPerms(info: IObjectGroupPermsResultStruct) {
    await setObjectsPerms(this.groupIdGetter, info)
    this.permsDialog = false
  }
  private getGroupObjectPermsFunc4Grp(): IObjectGroupPermsInitialAxiosResponsePromise {
    return getObjectsPerms(this.groupIdGetter)
  }

  private openPermsDialog(grp: IGroup) {
    GroupModule.SET_ALL_MGROUP(grp)
    this.permsDialog = true
  }
}
</script>
