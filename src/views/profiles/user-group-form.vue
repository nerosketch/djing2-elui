<template lang="pug">
  el-form(
    size="mini"
    :model="frmMod"
    v-loading="loading"
  )
    el-form-item(
      label="Название"
      prop='name'
    )
      el-input(v-model="frmMod.name" maxlength="150")
    el-form-item
      el-button-group
        el-button(
          type="primary" @click="onSubmit"
          icon='el-icon-upload' size='small'
          :disabled="isEmpty || !$perms.is_superuser"
        ) Сохранить
        el-button(
          @click="$emit('cancel')"
          icon="el-icon-close"
          size='small'
        ) Отмена
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
  get uGroupNameGetter() {
    return UserGroupModule.name
  }
  @Watch('uGroupNameGetter')
  private onCHUGroupName(name: string) {
    this.frmMod.name = name
  }

  private async onSubmit() {
    this.loading = true
    try {
      let changedUGroup
      if (this.isNew) {
        changedUGroup = await UserGroupModule.AddUserGroup(this.frmMod)
        this.$message.success('Новая группа добавлена')
      } else {
        changedUGroup = await UserGroupModule.PatchUserGroup(this.frmMod)
        this.$message.success('Группа изменена')
      }
      this.$emit('done', changedUGroup)
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.loading = false
    }
  }
}
</script>
