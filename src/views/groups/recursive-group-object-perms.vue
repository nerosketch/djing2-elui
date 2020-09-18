<template lang="pug">
  div
    h4 Какие группы сотрудников будут иметь доступ
    el-select(
      v-model="selectedProfileGroup"
      size="mini"
    )
      el-option(
        v-for="grp in groups"
        :key="grp.id"
        :label="grp.name"
        :value="grp.id"
      )
    h4 Какие права будет иметь выбранная группа сотрудников на выбранный объект, и все объекты, имеющие его в свойствах
    template(v-if="relatedPerms.length > 0")
      el-checkbox(
        v-for="p in relatedPerms"
        :key="p.id"
        :label="p.name"
        v-model="p.checked"
      )
    span(v-else)
      i.el-icon-loading
      |  Загрузка доступных прав...
    el-divider
    el-button(
      type="primary" @click="onSubmit"
      :disabled="selectedProfileGroup === 0 || !$perms.is_superuser"
      size='small'
      :loading="oProfileGroupsLoading"
    ) Сохранить
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { IPermission } from '@/api/types'
import { IUserGroup } from '@/api/profiles/types'
import { getUserGroups } from '@/api/profiles/req'
import {
  getGroupAllRelatedPerms,
  setGroupsPermissionsRecursive
} from '@/api/groups/req'

interface IExPermission extends IPermission {
  checked: boolean
}

@Component({
  name: 'RecursiveGroupObjectPerms'
})
export default class extends Vue {
  @Prop({ default: 0 }) private userGroupId!: number
  private oProfileGroupsLoading = false
  private groups: IUserGroup[] = []
  private selectedProfileGroup = 0
  private relatedPerms: IExPermission[] = []

private async loadUGroups() {
    this.oProfileGroupsLoading = true
    try {
      const { data } = await getUserGroups({
        page: 1,
        page_size: 0,
        fields: 'id,name'
      }) as any
      this.groups = data
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.oProfileGroupsLoading = false
    }
  }

  private async onSubmit() {
    let selectedPerms = this.relatedPerms.filter(p => p.checked)
    let selectedPermIds = selectedPerms.map(p => p.id)
    this.oProfileGroupsLoading = true
    try {
      const { data } = await setGroupsPermissionsRecursive(this.userGroupId, {
        permission_ids: selectedPermIds,
        profile_group: this.selectedProfileGroup
      })
      this.$message.success(data)
      this.$emit('done')
    } catch(err) {
      this.$message.error(err)
    } finally {
      this.oProfileGroupsLoading = false
    }
  }

  private async loadRelatedPerms() {
    const { data } = await getGroupAllRelatedPerms()
    this.relatedPerms = data.map(p => Object.assign({
      checked: false
    }, p))
  }

  created() {
    this.loadRelatedPerms()
    this.loadUGroups()
  }

  @Watch('userGroupId')
  private onChangeObj() {
    this.loadRelatedPerms()
    this.loadUGroups()
  }
}
</script>
