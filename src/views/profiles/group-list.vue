<template lang="pug">
  div
    datatable(
      :columns="tableColumns"
      :getData="loadUserGroups"
      :heightDiff="190"
      widthStorageNamePrefix="upg"
      ref="tbl")
      template(#btn="{row}")
        el-button-group
          el-button(
            icon="el-icon-lock"
            @click="editGroupPerms(row)"
          )

          el-button(
            icon="el-icon-edit"
            @click="editNewUserGroup(row)"
          )

          el-button(
            type="danger"
            icon="el-icon-close"
            @click="delUserGroup(row)"
          )

      el-button(icon="el-icon-plus" @click="addNewUserGroup")
        | {{ $t('add') }}

    el-dialog(
      :title="dialogTitle"
      :visible.sync="ugFormDialog"
      :close-on-click-modal="false")
      user-group-form(
        v-on:done="frmDone"
        v-on:cancel="ugFormDialog=false"
      )

    el-dialog(
      :title="$t('modifyTheRightsOfTheGroup')"
      top="5vh"
      width="80%"
      :visible.sync="ugpDialog"
      :close-on-click-modal="false")
      user-group-perms(v-on:done="editPermsDone")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
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
    datatable: DataTableComp,
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
      label: this.$tc('title'),
      'min-width': 150
    },
    {
      prop: 'permcount',
      label: this.$tc('permcount')
    },
    {
      prop: 'usercount',
      label: this.$tc('usercount')
    },
    {
      prop: 'btn',
      label: '#',
      'min-width': 90,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private loadUserGroups(params?: IDRFRequestListParameters) {
    if (params) {
      params.fields = 'id,name,permcount,usercount,permissions'
    }
    return getUserGroups(params)
  }

  private async editNewUserGroup(grp: IUserGroup) {
    await UserGroupModule.SET_ALL_USER_USER_GROUP(grp)
    this.dialogTitle = this.$tc('amendTheGroup')
    this.ugFormDialog = true
  }

  private async addNewUserGroup() {
    await UserGroupModule.RESET_ALL_USER_USER_GROUP()
    this.dialogTitle = this.$tc('addTheGroup')
    this.ugFormDialog = true
  }

  private delUserGroup(grp: IUserGroup) {
    this.$confirm(this.$tc('removeOptsFromPort')).then(async() => {
      await delUserGroup(grp.id)
      this.$message.success(this.$tc('groupRemoved'))
      this.$refs.tbl.LoadTableData()
    })
  }

  private frmDone() {
    this.ugFormDialog = false
    this.$refs.tbl.LoadTableData()
  }

  private async editGroupPerms(grp: IUserGroup) {
    await UserGroupModule.SET_ALL_USER_USER_GROUP(grp)
    this.ugpDialog = true
  }

  private editPermsDone() {
    this.ugpDialog = false
    this.$refs.tbl.LoadTableData()
  }

  // Breadcrumbs
  created() {
    BreadcrumbsModule.SetCrumbs([
      {
        path: '/',
        meta: {
          hidden: true,
          title: this.$tc('records')
        }
      }
    ] as any)
  }
  // End Breadcrumbs
}
</script>
