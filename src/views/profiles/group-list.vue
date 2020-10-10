<template lang="pug">
div
  datatable(
    :columns="tableColumns"
    :getData="loadUserGroups"
    :heightDiff='171'
    widthStorageNamePrefix='upg'
    ref='tbl'
  )
    template(v-slot:btn="{row}")
      el-button-group
        el-button(
          size='mini'
          icon='el-icon-lock'
          @click="editGroupPerms(row)"
        )
        el-button(
          size="mini"
          icon='el-icon-edit'
          @click="editNewUserGroup(row)"
        )
        el-button(
          type="danger" size="mini"
          icon='el-icon-close'
          @click="delUserGroup(row)"
        )

    el-button(
      icon='el-icon-plus'
      size='mini'
      @click="addNewUserGroup"
    ) Добавить
  el-dialog(
    :title="dialogTitle"
    :visible.sync="ugFormDialog"
  )
    user-group-form(
      v-on:done="frmDone"
      v-on:cancel="ugFormDialog=false"
    )
  el-dialog(
    title="Изменить права для группы"
    top="5vh"
    width="80%"
    :visible.sync="ugpDialog"
  )
    user-group-perms(
      v-on:done="editPermsDone"
    )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { RouteRecord } from 'vue-router'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { IDRFRequestListParameters } from '@/api/types'
import { getUserGroups, delUserGroup } from '@/api/profiles/req'
import { IUserGroup } from '@/api/profiles/types'
import { UserGroupModule } from '@/store/modules/profiles/user-group'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import UserGroupForm from './user-group-form.vue'
import UserGroupPerms from './user-group-perms.vue'

class DataTableComp extends DataTable<IUserGroup> {}

@Component({
  name: 'GroupList',
  components: {
    'datatable': DataTableComp,
    UserGroupForm,
    UserGroupPerms
  }
})
export default class extends Vue {
  public readonly $refs!: {
    tbl: DataTableComp
  }
  private ugFormDialog = false
  private dialogTitle = ''
  private ugpDialog = false
  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'name',
      label: 'Название',
      'min-width': 150
    },
    {
      prop: 'permcount',
      label: 'Кол. прав'
    },
    {
      prop: 'usercount',
      label: 'Кол. учёток'
    },
    {
      prop: 'btn',
      label: '—',
      'min-width': 90,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private async loadUserGroups(params?: IDRFRequestListParameters) {
    if (params) {
      params['fields'] = 'id,name,permcount,usercount,permissions'
    }
    try {
      const r = await getUserGroups(params)
      return r
    } catch (err) {
      this.$message.error(err)
    }
    return null
  }

  private async editNewUserGroup(grp: IUserGroup) {
    await UserGroupModule.SET_ALL_USER_USER_GROUP(grp)
    this.dialogTitle = 'Изменить группу'
    this.ugFormDialog = true
  }

  private async addNewUserGroup() {
    await UserGroupModule.RESET_ALL_USER_USER_GROUP()
    this.dialogTitle = 'Добавить группу'
    this.ugFormDialog = true
  }

  private delUserGroup(grp: IUserGroup) {
    this.$confirm('Удалить группу абонентов?').then(async() => {
      await delUserGroup(grp.id)
      this.$message.success('Группа уалена')
      this.$refs.tbl.GetTableData()
    })
  }

  private frmDone(ugrp?: IUserGroup) {
    this.ugFormDialog = false
    this.$refs.tbl.GetTableData()
  }

  private async editGroupPerms(grp: IUserGroup) {
    await UserGroupModule.SET_ALL_USER_USER_GROUP(grp)
    this.ugpDialog = true
  }

  private editPermsDone(grp: IUserGroup) {
    this.ugpDialog = false
    this.$refs.tbl.GetTableData()
  }

  // Breadcrumbs
  created() {
    BreadcrumbsModule.SetCrumbs([
      {
        path: '/',
        meta: {
          hidden: true,
          title: 'Учётные записи'
        }
      }
    ] as RouteRecord[])
  }
  // End Breadcrumbs
}
</script>
