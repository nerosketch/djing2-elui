<template lang="pug">
  div(
    v-loading='oPermsLoading'
  )
    el-checkbox(
      v-for="p in profiles"
      :key="p.pk"
      v-model="p.hasPerm"
      :label="p.full_name"
    )
    el-divider
    el-button(
      type="primary" @click="onSubmit"
      :disabled="!$perms.is_superuser"
      size='small'
    ) Сохранить
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { IUserProfile } from '@/api/profiles/types'
import { getActiveProfiles } from '@/api/profiles/req'
import { IDRFAxiosResponsePromise } from '../api/types'

interface IExtendedUserProfile extends IUserProfile {
  hasPerm?: boolean
}

@Component({
  name: 'ObjectPerms'
})
export default class extends Vue {
  private oPermsLoading = false
  private profiles: IExtendedUserProfile[] = []

  private async loadProfiles() {
    this.oPermsLoading = true
    try {
      const { data } = await getActiveProfiles({
        page: 1,
        page_size: 0,
        fields: 'pk,full_name,username,full_name'
      })
      this.profiles = data.map(p => Object.assign({ hasPerm: false }, p))
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.oPermsLoading = false
    }
  }

  private getProfilePrivaryKeys(): number[] {
    let allowProfiles = this.profiles.filter(p => p.hasPerm)
    return allowProfiles.map(p => p.pk)
  }

  private onSubmit() {
    this.$emit('save', this.getProfilePrivaryKeys())
  }

  created() {
    this.loadProfiles()
  }
}
</script>
