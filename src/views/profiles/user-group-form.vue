<template lang="pug">
  el-form(:model="frmMod" v-loading="loading")
    el-form-item(:label="$t('title')" prop="name")
      el-input(v-model="frmMod.name" maxlength="150")

    el-form-item
      el-button-group
        el-button(
          type="primary"
          @click="onSubmit"
          icon="el-icon-upload"
          :disabled="isEmpty || !$perms.is_superuser")
          | {{ $t('save') }}

        el-button(@click="$emit('cancel')" icon="el-icon-close")
          | {{ $t('cancellation') }}
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { UserGroupModule } from '@/store/modules/profiles/user-group'

@Component({
  name: 'UserGroupForm'
})
export default class extends Vue {
  private loading = false

  private frmMod = {
    name: ''
  }

  private get isEmpty() {
    return Boolean(!this.frmMod.name)
  }

  get isNew() {
    return UserGroupModule.id === 0
  }

  @Watch('$store.state.usergroup.name')
  private onCHUGroupName(name: string) {
    this.frmMod.name = name
  }

  private async onSubmit() {
    this.loading = true
    try {
      let changedUGroup
      if (this.isNew) {
        changedUGroup = await UserGroupModule.AddUserGroup(this.frmMod)
        this.$message.success(this.$tc('newGroupAdded'))
      } else {
        changedUGroup = await UserGroupModule.PatchUserGroup(this.frmMod)
        this.$message.success(this.$tc('groupAmended'))
      }
      this.$emit('done', changedUGroup)
    } finally {
      this.loading = false
    }
  }
}
</script>
