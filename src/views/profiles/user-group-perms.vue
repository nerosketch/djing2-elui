<template lang="pug">
div
  el-transfer(
    v-model="assignedPerms"
    :props="prop"
    :data="allPerms"
    :left-default-checked="leftChecked"
    :titles="['Все права', 'Назначенные права']"
  )
    template(v-slot:left-footer)
      el-button.transfer-footer(
        size="small"
        @click="selectReadonly"
      ) Выделить права на чтение
  el-button(
    size="small"
    icon='el-icon-upload'
    type="primary"
    :loading="saveLoading"
    :disabled="isUnTouched || !$perms.is_superuser"
    @click="savePerms"
  ) Сохранить
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { UserGroupModule } from '@/store/modules/profiles/user-group'
import PermMngMixin from './perm-mng-mixin'

@Component({
  name: 'UserGroupPerms'
})
export default class extends mixins(PermMngMixin) {
  private assignedPerms: number[] = this.$store.state.usergroup.permissions

  private async savePerms() {
    this.saveLoading = true
    let updatedGroup = await UserGroupModule.PatchUserGroup({
      permissions: this.assignedPerms
    })
    this.saveLoading = false
    this.$message.success('Права для группы сохранены')
    this.$emit('done', updatedGroup)
  }

  @Watch('$store.state.usergroup.permissions')
  private onChangedGroupAssignedPerms(perms: number[]) {
    this.assignedPerms = perms
  }

  get isUnTouched() {
    return this.assignedPerms === this.$store.state.usergroup.permissions
  }
}
</script>

<style lang="scss">
/* Ширина на всю высоту для transfer */
.el-transfer-panel__body {
  height: calc(100vh - 30vh);
  .el-checkbox-group {
    height: 100%;
  }
}
.el-transfer-panel {
  width: calc(51% - 106px);
}
</style>
