<template lang="pug">
div
  el-alert(
    v-if="$store.state.userprofile.is_superuser"
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
        @click="selectReadonly"
      ) Выделить права на чтение
  el-button(
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
  private assignedPerms: number[] = this.$store.state.userprofile.user_permissions

  private async savePerms() {
    this.saveLoading = true
    await UserProfileModule.PatchProfile({
      user_permissions: this.assignedPerms
    })
    this.saveLoading = false
    this.$message.success('Права для пользователся сохранены')
  }

  @Watch('$store.state.userprofile.user_permissions')
  private onChangedUserAssignedPerms(perms: number[]) {
    this.assignedPerms = perms
  }

  get isUnTouched() {
    return this.assignedPerms === this.$store.state.userprofile.user_permissions
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
