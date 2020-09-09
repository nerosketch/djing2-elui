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
  p assignedPerms {{ assignedPerms }}
  p allPerms {{ allPerms }}
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { IPermission } from '@/api/profiles/types';
import { getAllPermissions } from '@/api/profiles/req';

@Component({
  name: 'UserClassPerms'
})
export default class extends Vue {
  private assignedPerms: number[] = []
  private leftChecked: number[] = []
  private allPerms: IPermission[] = []

  private prop: object = {
    key: 'id',
    label: 'name'
  }

  @Watch('assignedPerms')
  private onChAssPerms(perms: number[]) {
    this.$message.success('Типо права для пользователся сохранены')
  }

  private async loadPerms() {
    const { data } = await getAllPermissions()
    this.allPerms = data
  }

  private selectReadonly() {
    let roPerms = this.allPerms.filter(el => el.codename.startsWith('view_'))
    if (roPerms.length > 0) {
      let res = []
      for (let p of roPerms) {
        res.push(p.id)
      }
      this.leftChecked = res
    } else {
      this.$message.info('Не нашёл права на чтение')
    }
  }

  created() {
    this.loadPerms()
  }
}
</script>

<style lang="scss">
/* Ширина на всю высоту для transfer */
.el-transfer-panel__body {
  height: calc(100vh - 27vh);
  .el-checkbox-group {
    height: 100%;
  }
}
.el-transfer-panel {
  width: 40%;
}
</style>