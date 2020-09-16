<template lang="pug">
  div
    template(v-if="groups.length > 0")
      el-checkbox(
        v-for="grp in groups"
        :key="grp.id"
        :label="grp.name"
        v-model="grp.checked"
      )

    span(v-else)
      i.el-icon-loading 
      | Загрузка...
    el-divider
    el-button(
      type='primary' size='mini'
      @click="saveGroups"
      :loading="loading"
      :disabled="!$perms.is_superuser"
    ) Сохранить
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IUserGroup } from '@/api/profiles/types'
import { getUserGroups } from '@/api/profiles/req'
import { UserProfileModule } from '@/store/modules/profiles/user-profile'

interface IExUserGroup extends IUserGroup {
  checked: boolean
}

@Component({
  name: 'ProfileGroups'
})
export default class extends Vue {
  private groups: IExUserGroup[] = []
  private loading = false

  private async loadGroups() {
    let p = {
      page: 1,
      page_size: 0,
      fields: 'id,name'
    }
    try {
      const { data } = await getUserGroups(p) as any
      const existingGIds = UserProfileModule.groups
      this.groups = data.map((g: IUserGroup) => Object.assign({
        checked: existingGIds.includes(g.id)
      }, g))
    } catch (err) {
      this.$message.error(err)
    }
  }

  created() {
    this.loadGroups()
  }

  private async saveGroups() {
    let grps = this.groups.filter(g => g.checked)
    let grpids = grps.map(g => g.id)
    this.loading = true
    try {
      const r = await UserProfileModule.PatchProfile({
        groups: grpids
      })
      this.$emit('done', r)
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.loading = false
    }
  }
}
</script>
