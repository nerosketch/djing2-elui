<template lang="pug">
el-form(
  :model='frmMod'
  v-loading='isLoading'
  :label-width="isMobileView ? undefined : '100px'"
  size="mini"
)
  el-card(shadow="never")
    template(v-slot:header)
      .clearfix Устройство
    el-row
      el-col(:span='8')
        b Устройство
      el-col(:span='16')
        device-select(
          v-model="frmMod.device"
          :groupId="groupId"
          :initialDevice="devComm"
        )
    el-row
      el-col(:span='8')
        b Порт оборудования
      el-col(:span='16')
        selected-dev-port(v-model='frmMod.dev_port' :deviceId='frmMod.device')
    el-row
      el-col(:span='8')
        el-button-group
          el-button(
            icon='el-icon-upload'
            type="primary" size="mini" @click="onSubmit"
            :loading="isLoading"
          ) Сохранить
          el-button(
            icon="el-icon-view" size="mini" @click="onGo2Dev"
            :disabled="!frmMod.device"
          ) Смотреть
          el-button(
            type="danger" icon="el-icon-delete"
            size="mini" @click="onClearDevice"
          ) Очистить
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import { CustomerModule } from '@/store/modules/customers/customer'
import DeviceSelect from '@/components/DeviceSelect/index.vue'
import SelectedDevPort from '@/components/DeviceSelect/selectDevPort.vue'

@Component({
  name: 'device',
  components: { DeviceSelect, SelectedDevPort }
})
export default class extends Vue {
  private isLoading = false

  private get isMobileView() {
    return AppModule.IsMobileDevice
  }

  private frmMod = {
    device: CustomerModule.device,
    dev_port: CustomerModule.dev_port
  }

  private get devComm() {
    return {
      pk: CustomerModule.device,
      comment: CustomerModule.device_comment
    }
  }

  get onChId() {
    return CustomerModule.pk
  }
  @Watch('onChId')
  private onChangedId() {
    this.frmMod = {
      device: CustomerModule.device,
      dev_port: CustomerModule.dev_port
    }
  }

  get groupId() {
    return CustomerModule.group
  }

  private async onSubmit() {
    this.isLoading = true
    const newDat = await CustomerModule.PatchCustomer(this.frmMod)
    this.isLoading = false
    this.$emit('done', newDat)
  }

  private onClearDevice() {
    this.$confirm('Действительно очистить устройство абонента?').then(async() => {
      this.isLoading = true
      const { data } = await CustomerModule.ClearDevice()
      this.frmMod.device = data.device
      this.frmMod.dev_port = data.dev_port
      this.$emit('done', data)
      this.isLoading = false
    })
  }

  private onGo2Dev() {
    this.$router.push({
      name: 'device-view',
      params: {
        devId: this.frmMod.device.toString()
      }
    })
  }
}
</script>
