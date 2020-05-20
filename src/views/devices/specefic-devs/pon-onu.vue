<template lang="pug">
  el-row(:gutter='5')
    el-col(:span='24')
      el-alert(
        v-if="macsNotEqual"
        title="Внимание!"
        description='Мак адрес в билинге не совпадает на мак адресом, полученным с OLT. Нужно обновить "Доп. инфо для snmp"'
        type="warning"
        effect="dark"
        show-icon
        center
      )
    el-col(:lg="12" :sm='24')
      list(
        :items="devInfo"
        :loading='devInfoLoading'
      )
        template(v-slot:header)
          .clearfix {{ `${device.comment} - ${device.dev_type_str || 'PON ONU'}` }} &nbsp;
            small {{ `${device.ip_address || device.mac_addr}` }}
            el-button(style="float: right; padding: 7px" circle size='mini' icon='el-icon-edit' type='primary' @click="openDevForm")
        template(v-slot:footer)
          el-button-group
            el-button(size='mini' icon='el-icon-s-tools' disabled) Зарегистрировать устройство
            el-button(size='mini' icon='el-icon-refresh' disabled) Перезагрузить
    el-col(:lg="12" :sm='24')
      el-card.box-card(
        shadow="never"
        body-style="padding: 10px;"
      )
        template(v-slot:header)
          slot(name="header")
            .clearfix Состояние ONU
        el-row(type='flex')
          el-col(style='width: 128px;')
            i.icon-big(:class="iconStatusClass")
          el-col(v-if="onuDetails !== null")
            .text.item.list-item
              b Ур. сигнала: 
              | {{ onuDetails.signal }}
            .text.item.list-item
              b Серийник: 
              | {{ onuDetails.serial }}
            .text.item.list-item
              b Тип onu: 
              | {{ onuDetails.onu_type }}
            .text.item.list-item
              b Интерфейс: 
              | {{ onuDetails.int_name }}
            .text.item.list-item
              b MAC адрес на OLT: 
              | {{ onuDetails.mac }}
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
import List from '@/components/List/index.vue'
import { IDevice, IOnuDetails, IOnuDetailsStatus } from '@/api/devices/types'
import { scanDetails } from '@/api/devices/req'
import DevForm from '../dev-form.vue'

@Component({
  name: 'PonOnu',
  components: {
    List,
    DevForm
  }
})
export default class extends Vue {
  @Prop({ default: null }) private device!: IDevice | null
  private devInfoLoading = false
  private devFormDialog = false
  private onuDetails: IOnuDetails | null = null

  private devInfo = this.device === null ? [] : [
    { text: `IP адрес: ${this.device.ip_address || '-'}` },
    { text: `Мак: ${this.device.mac_addr}` },
    { text: `Описание: ${this.device.comment}` },
    { text: `Родительское устройство: ${this.device.parent_dev_name}` }
  ]

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

  get macsNotEqual() {
    if (this.onuDetails === null) return false
    if (this.device === null) return false
    return this.onuDetails.mac !== this.device.mac_addr
  }

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
    this.$router.push({ name: 'devicesList', params: { groupId: device.group.toString() } })
  }

  created() {
    this.getDetails()
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
