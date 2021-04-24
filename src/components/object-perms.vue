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
    h4 Какие права будет иметь выбранная группа сотрудников
    template(v-if="initialGroupPerms")
      el-checkbox(
        v-for="p in initialGroupPerms.availablePerms"
        :key="p.id"
        :label="p.name"
        v-model="p.checked"
      )
    span(v-else)
      i.el-icon-loading
      |  Загрузка доступных прав...
    el-divider
    el-button(
      icon='el-icon-upload'
      type="primary" @click="onSubmit"
      :disabled="!$perms.is_superuser"
      size='small'
      :loading="oGroupsLoading"
    ) Сохранить
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { AxiosPromise } from 'axios'
import {
  IObjectGroupPermsResultStruct,
  IPermission,
  IObjectGroupPermsInitialAxiosResponsePromise,
  IObjectGroupPermsInitial
} from '@/api/types'
import { IUserGroup } from '@/api/profiles/types'
import { getUserGroups } from '@/api/profiles/req'

interface IExPermission extends IPermission {
  checked?: boolean
}

interface IExObjectGroupPermsInitial extends IObjectGroupPermsInitial {
  availablePerms: IExPermission[]
}

@Component({
  name: 'ObjectPerms'
})
export default class extends Vue {
  @Prop({ default: null }) private getGroupObjectPermsFunc!: () => IObjectGroupPermsInitialAxiosResponsePromise
  @Prop({ default: null }) private getSelectedObjectPerms!: (objectId: number, profileGroupId: number) => AxiosPromise<number[]>
  @Prop({ default: 0 }) private objId!: number
  private oGroupsLoading = false
  private groups: IUserGroup[] = []
  private selectedProfileGroup = 0
  private initialGroupPerms: IExObjectGroupPermsInitial | null = null

  private async loadUGroups() {
    this.oGroupsLoading = true
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
      this.oGroupsLoading = false
    }
  }

  private async onSubmit() {
    let selectedPerms = this.initialGroupPerms ? this.initialGroupPerms.availablePerms.filter(p => p.checked) : []
    let res: IObjectGroupPermsResultStruct = {
      groupId: this.selectedProfileGroup,
      selectedPerms: selectedPerms.map(p => p.id)
    }
    await this.$emit('save', res)
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

  @Watch('groups')
  private onChangeGroups(grps: IUserGroup[]) {
    if (grps.length > 0) {
      this.selectedProfileGroup = grps[0].id
    } else {
      this.selectedProfileGroup = 0
    }
  }

  @Watch('selectedProfileGroup')
  private async onChangedSelectedProfileGroup(selectedGroupId: number) {
    // load perms for selected group
    if (this.initialGroupPerms) {
      try {
        this.oGroupsLoading = true
        const { data } = await this.getSelectedObjectPerms(this.objId, selectedGroupId)
        // data := selected perms
        for (let ap of this.initialGroupPerms.availablePerms) {
          this.$set(ap, 'checked', data.includes(ap.id))
        }
      } catch (err) {
        this.$message.error(err)
      } finally {
        this.oGroupsLoading = false
      }
    }
  }
}
</script>

<style>
.el-dialog__body {
  padding: 0px 30px 20px 30px !important;
}
</style>
