<template lang="pug">
  el-card(shadow='never')
    template(v-slot:header)
      span Варианты конфигурации порта

    span Шаблон конфига для порта
    el-select(v-model="portConfigType" size='mini' placeholder="Шаблон конфига")
      el-option(
        v-for="(v, i) in configTypeCodes"
        :key="i"
        :value='v.code'
        :label='v.title'
      )

    generic-vlan-config(
      :portVlanConf.sync="portVlanConf"
    )
</template>

<script lang="ts">
import { IDevConfigChoice, IDeviceSwitchPortConfigChoicesEnum, IDevVlanSimpleInfo } from '@/api/devices/types'
import { Component, Prop, Vue } from 'vue-property-decorator'
import GenericVlanConfig from '@/views/devices/vlan-config/generic-vlan-config.vue'

@Component({
  name: 'PortVlanConfig',
  components: {
    GenericVlanConfig
  }
})
export default class extends Vue {
  @Prop({ required: true })
  private portVlanConf!: IDevVlanSimpleInfo

  private portConfigType = IDeviceSwitchPortConfigChoicesEnum.TRUNK

  private configTypeCodes: IDevConfigChoice[] = [
    { code: IDeviceSwitchPortConfigChoicesEnum.TRUNK, title: 'Trunk', accept_vlan: true },
    { code: IDeviceSwitchPortConfigChoicesEnum.ACCESS, title: 'Access', accept_vlan: true },
  ]
}
</script>
