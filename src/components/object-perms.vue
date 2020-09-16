<template lang="pug">
  div
    h4 Какие группы сотрудников будут иметь доступ
    el-checkbox(
      v-for="g in groups"
      :key="g.id"
      v-model="g.checked"
      :label="g.name"
    )
    el-divider
    h4 Какие права будут иметь выбранные группы сотрудников
    template(v-if="initialGroupPerms")
      el-checkbox(
        v-for="p in initialGroupPerms.availablePerms"
        :key="p.id"
        :label="p.name"
        v-model="p.checked"
      )
    span(v-else) Загрузка доступных прав...
    el-divider
    el-button(
      type="primary" @click="onSubmit"
      :disabled="!$perms.is_superuser"
      size='small'
      :loading="oGroupsLoading"
    ) Сохранить
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { IObjectGroupPermsResultStruct, IPermission, IObjectGroupPermsInitialAxiosResponsePromise, IObjectGroupPermsInitial } from '@/api/types'
import { IUserGroup } from '@/api/profiles/types'
import { getUserGroups, getAllPermissions } from '@/api/profiles/req'

interface IExUserGroup extends IUserGroup {
  checked: boolean
}

@Component({
  name: 'ObjectPerms'
})
export default class extends Vue {
  @Prop({ default: null }) private getGroupObjectPermsFunc!: () => IObjectGroupPermsInitialAxiosResponsePromise
  @Prop({ default: 0 }) private objId!: number
  private oGroupsLoading = false
  private groups: IExUserGroup[] = []
  private initialGroupPerms: IObjectGroupPermsInitial | null = null

  private async loadUGroups() {
    this.oGroupsLoading = true
    try {
      const { data } = await getUserGroups({
        page: 1,
        page_size: 0,
        fields: 'id,name'
      }) as any
      this.groups = data.map((p: IUserGroup) => Object.assign({
        checked: this.initialGroupPerms ? this.initialGroupPerms.groupIds.includes(p.id) : false
      }, p))
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.oGroupsLoading = false
    }
  }

  private async onSubmit() {
    let checkedGroups = this.groups.filter(g => g.checked)
    let selectedPerms = this.initialGroupPerms ? this.initialGroupPerms.availablePerms.filter(p => p.checked) : []
    let res: IObjectGroupPermsResultStruct = {
      groupIds: checkedGroups.map(g => g.id),
      selectedPerms: selectedPerms.map(p => p.id)
    }
    this.oGroupsLoading = true
    await this.$emit('save', res)
    this.oGroupsLoading = false
  }

  private async getInitialObjPerms() {
    const { data } = await this.getGroupObjectPermsFunc()
    this.initialGroupPerms = data
  }

  async created() {
    await this.getInitialObjPerms()
    this.loadUGroups()
  }

  @Watch('objId')
  private async onChangeObj() {
    await this.getInitialObjPerms()
    this.loadUGroups()
  }
}
</script>

<style>
.el-dialog__body {
  padding: 0px 30px 20px 30px !important;
}
</style>
