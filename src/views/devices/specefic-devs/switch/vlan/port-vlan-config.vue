<template lang="pug">
  el-card(shadow='never')
    template(v-slot:header)
      span Варианты конфигурации на ONU

    span Шаблон конфига для ONU
    el-select(v-model="currentConfig.configTypeCode" size='mini' placeholder="Шаблон конфига")
      el-option(
        v-for="(v, i) in configTypeCodes"
        :value='v.code'
        :label='v.title'
        :key="i"
      )

    template(v-if="isAcceptVlanSelectedConfig")
      el-col(:span="4" v-for="(v, i) in vlans" :key="i")
        el-tooltip.item(
          content="Vlan"
          placement="top"
        )
          el-button-group
            el-button.onuvlan_miniwidth(
              :type='v.native ? "info" : "primary"'
              size='mini'
              @click="changeVlanMode(portVlanConf.port, v)"
            ) {{ v.native ? 'A' : 'T' }}
            el-button(size='mini') {{ v.vid }}
            el-button.onuvlan_miniwidth(
              type='danger'
              size='mini'
              icon='el-icon-close'
              @click="vlanRemove(portVlanConf.port, v)"
            )

      el-button(
        type="success"
        icon="el-icon-plus"
        size='mini'
        circle
        :disabled="!$perms.networks.view_vlanif"
        @click="openAddVlanDialog(portVlanConf.port)"
      )

    el-card(
      shadow='never'
      v-else
    )
      span Настройка VLAN не принимается выбранным конфигом

    el-button-group
      el-button(
        type="primary"
        icon="el-icon-download"
        @click="onSubmit"
        :loading="vlanLoading"
        size='mini'
      ) Применить

    el-dialog(
      :visible.sync="addVlanVisible"
      title="Добавить vlan на порт"
      :close-on-click-modal="false"
    )
      keep-alive
        add-vlan(
          v-on:done="addVlanDone"
          :vlans="vlans"
        )
</template>

<script lang="ts">
import { IDevVlan } from '@/api/devices/types'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'PortVlanConfig'
})
export default class extends Vue {
  private vlans: IDevVlan[] = []

  private currentConfig = {
    configTypeCode: 0
  }

  private configTypeCodes = [
    { code: 1, title: 'Trunk' },
    { code: 2, title: 'Access' },
  ]

  get isAcceptVlanSelectedConfig() {
    return true
  }

  private changeVlanMode(portNum: number, v: IDevOnuVlan) {
    if (!v.native && this.nativeVlanCount(portNum) > 0) {
      this.$message.error(multipleAccessVlanMsg)
      return
    }
    v.native = !v.native
    this.$message.success('Изменён режим Trunk/Success')
  }
}
</script>
