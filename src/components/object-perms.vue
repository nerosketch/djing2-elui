<template lang="pug">
  div(v-loading='oGroupsLoading')
    h4 Какие группы сотрудников будут иметь доступ
    el-checkbox(
      v-for="g in groups"
      :key="g.id"
      v-model="g.checked"
      :label="g.name"
    )
    el-divider
    h4 Какие права будут иметь выбранные группы сотрудников
    el-checkbox(
      v-for="p in allPerms"
      :label="p.name"
      v-model="p.checked"
    )
    el-divider
    el-button(
      type="primary" @click="onSubmit"
      :disabled="!$perms.is_superuser"
      size='small'
    ) Сохранить
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { IObjectGroupPermsResultStruct, IObjectGroupPermsResultStructAxiosResponsePromise } from '@/api/types'
import { IUserGroup, IPermission } from '@/api/profiles/types'
import { getUserGroups } from '@/api/profiles/req'
import PermMngMixin from '@/views/profiles/perm-mng-mixin'

interface IExUserGroup extends IUserGroup {
  checked: boolean
}

interface IExPerm extends IPermission {
  checked?: boolean
}

@Component({
  name: 'ObjectPerms'
})
export default class extends mixins(PermMngMixin) {
  @Prop({ default: null }) private getGroupObjectPermsFunc!: () => IObjectGroupPermsResultStructAxiosResponsePromise
  private oGroupsLoading = false
  private groups: IExUserGroup[] = []
  private initialGroupPerms?: IObjectGroupPermsResultStruct

  private async loadUGroups() {
    this.oGroupsLoading = true
    try {
      const { data } = await getUserGroups({
        page: 1,
        page_size: 0,
        fields: 'id,name'
      }) as any
      //- Fixme: specify an existing falue for 'checked'
      if (this.initialGroupPerms) {
        this.groups = data.map((p: IUserGroup) => Object.assign({
          checked: this.initialGroupPerms.groupIds.includes(p.id)
        }, p))
      } else {
        this.groups = data.map((p: IUserGroup) => Object.assign({
          checked: false
        }, p))
      }
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.oGroupsLoading = false
    }
  }

  private onSubmit() {
    let checkedGroups = this.groups.filter(g => g.checked)
    let selectedPerms = this.allPerms.filter((p: IExPerm) => p.checked)
    let res: IObjectGroupPermsResultStruct = {
      groupIds: checkedGroups.map(g => g.id),
      selectedPerms: selectedPerms.map(p => p.id)
    }
    console.log('object perms Submit', res)
    this.$emit('save', res)
  }

  private async getInitialObjPerms() {
    const { data } = await this.getGroupObjectPermsFunc()
    this.initialGroupPerms = data
  }

  async created() {
    await this.getInitialObjPerms()
    this.loadUGroups()
    this.loadPerms()
  }
}
</script>

<style>
.el-dialog__body {
  padding: 0px 30px 20px 30px !important;
}
</style>
