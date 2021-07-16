<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="loadGroups"
      widthStorageNamePrefix='groups'
      ref='grouptable'
    )
      template(v-slot:oper="{row}")
        el-button-group
          el-button(
            v-if="$perms.is_superuser"
            @click="openSitesDlg(row)"
            size="mini"
          ) C
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
      :close-on-click-modal="false"
    )
      group-form(
        v-on:done="frmDone"
      )

    el-dialog(
      :title="`Кто имеет права на группу абонентов \"${GroupTitleGetter}\"`"
      :visible.sync="permsDialog"
      top="5vh"
      :close-on-click-modal="false"
    )
      object-perms(
        v-on:save="changeGroupObjectPerms"
        :getGroupObjectPermsFunc="getGroupObjectPermsFunc4Grp"
        :getSelectedObjectPerms="groupGetSelectedObjectPerms"
        :objId="groupIdGetter"
      )

    el-dialog(
      title="Принадлежность сайтам"
      :visible.sync="sitesDlg"
      :close-on-click-modal="false"
    )
      sites-attach(
        :selectedSiteIds="$store.state.group.sites"
        v-on:save="groupSitesSave"
      )

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { GroupModule } from '@/store/modules/groups/index'
import { IDRFRequestListParameters, IObjectGroupPermsResultStruct } from '@/api/types'
import { getGroups, setGroupObjectsPerms, getGroupObjectsPerms, getGroupSelectedObjectPerms } from '@/api/groups/req'
import { IGroup } from '@/api/groups/types'
import GroupForm from './group-form.vue'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'

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
    grouptable: DataTableComp
  }
  private dialogVisible = false
  private permsDialog = false
  private sitesDlg = false

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'title',
      label: 'Название',
      sortable: true,
      'min-width': 250
    },
    {
      prop: 'oper',
      label: 'Кнопки',
      'min-width': 195,
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

  private loadGroups(params?: IDRFRequestListParameters) {
    if (params) {
      params['fields'] = 'pk,title,sites'
    }
    return getGroups(params)
  }

  private delGroup(group: IGroup) {
    this.$confirm(`Действительно удалить группу "${group.title}"?`).then(async() => {
      await GroupModule.DelGroup(group.pk)
      this.$message.success(`Группа "${group.title}" удалена`)
      this.$refs.grouptable.GetTableData()
    })
  }

  private frmDone() {
    this.dialogVisible = false
    this.$message.success('Группа сохранена')
    this.$refs.grouptable.GetTableData()
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
    ] as any[])
  }
  // End Breadcrumbs

  private openPermsDialog(grp: IGroup) {
    GroupModule.SET_ALL_MGROUP(grp)
    this.permsDialog = true
  }

  private async changeGroupObjectPerms(info: IObjectGroupPermsResultStruct) {
    await setGroupObjectsPerms(this.groupIdGetter, info)
    this.permsDialog = false
  }
  private getGroupObjectPermsFunc4Grp() {
    return getGroupObjectsPerms(this.groupIdGetter)
  }
  private groupGetSelectedObjectPerms(grpId: number, profileGroupId: number) {
    return getGroupSelectedObjectPerms(grpId, profileGroupId)
  }

  private groupSitesSave(selectedSiteIds: number[]) {
    GroupModule.PatchGroup({
      sites: selectedSiteIds
    }).then(() => {
      this.$refs.grouptable.GetTableData()
      this.$message.success('Принадлежность группы сайтам сохранена')
    })
    this.sitesDlg = false
  }
  private openSitesDlg(grp: IGroup) {
    GroupModule.SET_ALL_MGROUP(grp)
    this.sitesDlg = true
  }
}
</script>
