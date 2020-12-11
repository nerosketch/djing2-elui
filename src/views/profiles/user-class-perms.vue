<template lang="pug">
div
  el-alert(
    v-if="isSuperAdmin"
    title="Внимание!"
    description='Пока учётная запись имеет статус суперпользователя, то изменение прав для неё не имеет смысла, т.к. у суперпользователей права не проверяются, им ВСЁ можно'
    type="warning"
    effect="dark"
    :closable="false"
    show-icon
    center
  )
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
import { UserProfileModule } from '@/store/modules/profiles/user-profile'
import PermMngMixin from './perm-mng-mixin'

@Component({
  name: 'UserClassPerms'
})
export default class extends mixins(PermMngMixin) {
  private assignedPerms: number[] = this.assignedUserPerms

  private async savePerms() {
    this.saveLoading = true
    let updatedUser = await UserProfileModule.PatchProfile({
      user_permissions: this.assignedPerms
    })
    this.saveLoading = false
    this.$message.success('Права для пользователся сохранены')
  }

  get assignedUserPerms(): number[] {
    return UserProfileModule.user_permissions
  }

  get isSuperAdmin() {
    return UserProfileModule.is_superuser
  }

  @Watch('assignedUserPerms')
  private onChangedUserAssignedPerms(perms: number[]) {
    this.assignedPerms = perms
  }

  get isUnTouched() {
    return this.assignedPerms === this.assignedUserPerms
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
  width: 40%;
}
</style>
