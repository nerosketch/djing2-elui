<template lang="pug">
  div(v-loading='oGroupsLoading')
    el-checkbox(
      v-for="g in groups"
      :key="g.id"
      v-model="g.checked"
      :label="g.name"
    )
    el-divider
    el-button(
      type="primary" @click="onSubmit"
      :disabled="!$perms.is_superuser"
      size='small'
    ) Сохранить
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IUserGroup } from '@/api/profiles/types'
import { getUserGroups } from '@/api/profiles/req'

interface IExUserGroup extends IUserGroup {
  checked: boolean
}

@Component({
  name: 'ObjectPerms'
})
export default class extends Vue {
  private oGroupsLoading = false
  private groups: IExUserGroup[] = []

  private async loadUGroups() {
    this.oGroupsLoading = true
    try {
      const { data } = await getUserGroups({
        page: 1,
        page_size: 0,
        fields: 'id,name'
      }) as any
      //- Fixme: specify an existing falue for 'checked'
      this.groups = data.map((p: IUserGroup) => Object.assign({ checked: false }, p))
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.oGroupsLoading = false
    }
  }

  private onSubmit() {
    let checkedGroups = this.groups.filter(g => g.checked)
    let grpIds = checkedGroups.map(g => g.id)
    this.$emit('save', grpIds)
  }

  created() {
    this.loadUGroups()
  }
}
</script>
