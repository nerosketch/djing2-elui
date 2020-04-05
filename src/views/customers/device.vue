<template lang="pug">
el-form(
  :model='frmMod'
  v-loading='isLoading'
)
  el-card.box-card
    .clearfix(slot='header')
      span Устройство
    el-row
      el-col(:span='12')
        b Устройство
      el-col(:span='12')
        el-button-group
          el-button(type='primary') Название
          el-select(v-model='frmMod.device')
            el-option(
              v-for="dv in devices"
              :key="dv.pk"
              :label="dv.comment"
              :value="dv.pk"
            )
    el-row
      el-col(:span='12')
        b Порт устройства
      el-col(:span='12')
        el-select(v-model='frmMod.dev_port')
          el-option(
            v-for="dp in devPorts"
            :key="dp.pk"
            :label="dp.descr"
            :value="dp.pk"
          )
    el-row
      el-col(:span='12')
        el-button(type="primary" @click="onSubmit" :loading="isLoading") Сохранить
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IPort, IDevice } from '@/api/devices/types'
import { ICustomer } from '@/api/customers/types'
import { CustomerModule } from '@/store/modules/customers/customer'
import { getPorts, getDevices } from '../../api/devices/req'

@Component({
  name: 'device'
})
export default class extends Vue {

  private isLoading = false
  private devPorts: IPort[] = []
  private devices: IDevice[] = []

  private frmMod: ICustomer = <ICustomer> {
    pk: CustomerModule.pk,
    device: CustomerModule.device,
    dev_port: CustomerModule.dev_port
  }

  private async loadDevPorts() {
    this.isLoading = true
    const { data } = await getPorts(CustomerModule.device)
    this.devPorts = data.results
    this.isLoading = false
  }

  private async loadDevices() {
    this.isLoading = true
    const { data } = await getDevices({
      page: 1,
      page_size: 100,
      group: CustomerModule.group
    })
    this.devices = data.results
    this.isLoading = false
  }

  created() {
    this.loadDevices()
    this.loadDevPorts()
  }

  private async onSubmit() {
    this.isLoading = true
    await CustomerModule.SET_ALL(this.frmMod)
    const newDat = await CustomerModule.SaveCustomer()
    this.isLoading = false
    this.$emit('done', newDat)
  }
}
</script>