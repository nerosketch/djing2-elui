<template lang="pug">
  el-row(:gutter='5')
    el-col(:span='24')
      //- el-alert(
      //-   v-if="macsNotEqual"
      //-   title="Внимание!"
      //-   description='Мак адрес в билинге не совпадает на мак адресом, полученным с OLT. Нужно обновить "Доп. инфо для snmp"'
      //-   type="warning"
      //-   effect="dark"
      //-   show-icon
      //-   center
      //- )
    el-col(:lg="12" :sm='24' v-if="device")
      el-card.box-card(
        shadow="never"
        body-style="padding: 10px;"
      )
        template(v-slot:header)
          slot(name="header")
            .clearfix {{ `${device.comment} - ${device.dev_type_str || 'PON ONU'}` }} &nbsp;
              small {{ `${device.ip_address || device.mac_addr}` }}
              el-button(style="float: right; padding: 7px" circle size='mini' icon='el-icon-edit' type='primary' @click="openDevForm")
        .text.item.list-item IP адрес: {{ device.ip_address || '-' }}
        .text.item.list-item
          b Мак: 
          | {{ device.mac_addr }}
        .text.item.list-item
          b Описание: 
          | {{ device.comment }}
        .text.item.list-item
          b Родительское устройство: 
          el-link(type="primary")
            router-link(:to="{name: 'device-view', params: { devId: device.parent_dev }}") {{ device.parent_dev_name }}
        .text.item.list-item
          b Прикреплённые абоненты: 
          el-link(type="primary" v-for="(ab, i) in device.attached_users" :key="i")
            router-link(:to="{name: 'customerDetails', params:{ uid: ab.pk }}") {{ ab.full_name }}
        el-button-group
          register-device-btn(:device="device" v-on:done="getDetails")
          delete-from-olt-btn(:device="device" v-on:done="getDetails")

    el-col(:lg="12" :sm='24')
      el-card.box-card(
        shadow="never"
        body-style="padding: 10px;"
      )
        template(v-slot:header)
          slot(name="header")
            .clearfix Состояние ONU
              el-button(style="float: right; padding: 7px" circle size='mini' icon='el-icon-refresh' type='primary' @click="refreshDev")
        el-row(type='flex')
          el-col(style='width: 128px;')
            i.icon-big(:class="iconStatusClass")
          el-col(v-if="onuDetails !== null")
            .text.item.list-item
              b Уровень сигнала: 
              | {{ onuDetails.signal }}
            .text.item.list-item(v-for="(inf, i) in onuDetails.info" :key="i")
              b {{ inf[0] }}: 
              | {{ inf[1] }}
    el-dialog(
      :visible.sync="devFormDialog"
      title="Изменить ONU"
    )
      dev-form(
        v-on:done="devFrmDone"
      )
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { IDevice, IOnuDetails, IOnuDetailsStatus } from '@/api/devices/types'
import { scanDetails } from '@/api/devices/req'
import DevForm from '../../dev-form.vue'
import RegisterDeviceBtn from './register-device-btn.vue'
import DeleteFromOltBtn from './delete-from-olt-btn.vue'

@Component({
  name: 'PonOnu',
  components: {
    DevForm,
    RegisterDeviceBtn,
    DeleteFromOltBtn
  }
})
export default class extends Vue {
  @Prop({ default: null }) private device!: IDevice | null
  private devFormDialog = false
  private onuDetails: IOnuDetails | null = null

  get iconStatusClass() {
    return {
      success: this.isStatusSuccess,
      'el-icon-check': this.isStatusSuccess,
      error: this.isStatusError,
      'el-icon-circle-close': this.isStatusError,
      'el-icon-question': this.isStatusUnknown
    }
  }
  get isStatusSuccess() {
    return this.onuDetails !== null && this.onuDetails.status === IOnuDetailsStatus.UP
  }
  get isStatusError() {
    return this.onuDetails !== null && this.onuDetails.status === IOnuDetailsStatus.DOWN
  }
  get isStatusUnknown() {
    return !this.onuDetails || this.onuDetails.status === IOnuDetailsStatus.UNKNOWN
  }

  // get macsNotEqual() {
  //   if (this.onuDetails === null) return false
  //   if (this.device === null) return false
  //   return this.onuDetails.mac !== this.device.mac_addr
  // }

  private async getDetails() {
    if (this.device !== null) {
      const { data } = await scanDetails(this.device.pk)
      this.onuDetails = data
    }
  }

  private openDevForm() {
    this.devFormDialog = true
  }

  private devFrmDone(device: IDevice) {
    this.devFormDialog = false
    this.$message.success('Успешно сохранено')
    this.refreshDev()
    this.getDetails()
  }

  created() {
    this.getDetails()
  }

  private refreshDev() {
    this.$emit('reqrefresh')
  }
}
</script>

<style lang="scss">
.icon-big {
  font-size: 8rem;

  &.success {
    color: #3c763d;
  }

  &.error {
    color: #a94442;
  }
}
</style>
