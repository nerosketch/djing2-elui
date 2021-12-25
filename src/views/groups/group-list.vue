<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="loadGroups"
      widthStorageNamePrefix="groups"
      ref="grouptable")
      template(v-slot:oper="{row}")
        el-button-group
          el-button(v-if="$perms.is_superuser", @click="openSitesDlg(row)")
            | C
        
          el-button(
            icon="el-icon-lock"
            @click="openPermsDialog(row)"
            v-if="$perms.is_superuser")
        
          el-button(
            icon="el-icon-edit"
            @click="openEdit(row)"
            :disabled="!$perms.groupapp.change_group")
        
          el-button(
            type="danger"
            icon="el-icon-delete"
            @click="delGroup(row)"
            :disabled="!$perms.groupapp.delete_group")
    
      el-button(
        icon="el-icon-plus"
        @click="openNew"
        :disabled="!$perms.groupapp.add_group")
        | {{ $t('addTheGroup') }}
  
    el-dialog(
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false")
      group-form(v-on:done="frmDone")
  
    el-dialog(
      :title="`${$t('whoSEntitledToAGroupOfSubscribers+')} ${GroupTitleGetter}`"
      :visible.sync="permsDialog"
      top="5vh"
      :close-on-click-modal="false")
      object-perms(
        v-on:save="changeGroupObjectPerms"
        :getGroupObjectPermsFunc="getGroupObjectPermsFunc4Grp"
        :getSelectedObjectPerms="groupGetSelectedObjectPerms"
        :objId="groupIdGetter")
  
    el-dialog(
      :title="$t('facilities')"
      :visible.sync="sitesDlg"
      :close-on-click-modal="false")
      sites-attach(:selectedSiteIds="$store.state.group.sites", v-on:save="groupSitesSave")
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
    datatable: DataTableComp
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
      label: this.$t('title'),
      sortable: true,
      'min-width': 250
    },
    {
      prop: 'op.',
      label: this.$t('buttons'),
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
    let t
    if (this.groupIdGetter === 0) {
      t = this.$t('add').toString()
    } else {
      t = this.$t('change').toString()
    }
    return `${t} ${this.$t('groups.minAGroup')}`
  }

  get groupIdGetter() {
    return GroupModule.id
  }

  private loadGroups(params?: IDRFRequestListParameters) {
    if (params) {
      params.fields = 'id,title,sites'
    }
    return getGroups(params)
  }

  private delGroup(group: IGroup) {
    this.$confirm(`${this.$t('itSTrueToRemoveTheGroup.')} ${group.title}?`).then(async() => {
      await GroupModule.DelGroup(group.id)
      this.$message.success(`${this.$t('groupRemoved')} ${group.title}`)
      this.$refs.grouptable.LoadTableData()
    })
  }

  private frmDone() {
    this.dialogVisible = false
    this.$message.success(this.$t('groupRetained'))
    this.$refs.grouptable.LoadTableData()
  }

  // Breadcrumbs
  created() {
    BreadcrumbsModule.SetCrumbs([
      {
        path: '/',
        meta: {
          hidden: true,
          title: this.$t('panels')
        }
      }
    ] as any)
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
      this.$refs.grouptable.LoadTableData()
      this.$message.success(this.$t('theOwnershipOfThe'))
    })
    this.sitesDlg = false
  }

  private openSitesDlg(grp: IGroup) {
    GroupModule.SET_ALL_MGROUP(grp)
    this.sitesDlg = true
  }
}
</script>
