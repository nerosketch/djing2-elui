<template lang="pug">
  el-row(:gutter="5")
    el-col(
      :lg="12"
      :sm="24"
      v-if="device")
      el-card(
        shadow="never"
        body-style="padding: 10px;"
      )
        template(#header)
          | {{ `${device.comment} - ${device.dev_type_str || 'PON ONU'}` }}

          small  {{ `${device.ip_address || device.mac_addr}` }}

          el-link(
            style="float: right"
            icon="el-icon-edit"
            @click="openDevForm")

        .text.item.list-item
          | {{ $t('ipAddress', [device.ip_address || '-']) }}

        .text.item.list-item
          b {{ $t('devices.mac') }}
          | {{ device.mac_addr }}

        .text.item.list-item
          b {{ $t('description') }}
          | {{ device.comment }}

        .text.item.list-item
          b {{ $t('parentDev') }}

          router-link.el-link.el-link--primary.is-underline(:to="{name: 'device-view', params: { devId: device.parent_dev }}")
            | {{ device.parent_dev_name }}

        .text.item.list-item(v-if="device.iface_name")
          b {{ $t('interface') }}
          | {{ device.iface_name }}

        .text.item.list-item
          b {{ $t('devices.affixedSubscribers') }}

          router-link.el-link.el-link--primary.is-underline(
            v-for="(ab, i) in device.attached_users"
            :key="i"
            :to="{name: 'customerDetails', params:{ uid: ab.id }}")
            | {{ ab.full_name }}

        el-button-group
          delete-from-olt-btn(
            :devId="device.id"
            v-on:done="getDetails"
          )

          el-button(
            type="danger"
            icon="el-icon-delete"
            @click="delDevice"
            :disabled="!$perms.devices.delete_device")
            | {{ $t('del') }}

    el-col(:lg="12" :sm="24")
      el-card(
        shadow="never"
        body-style="padding: 10px;"
      )
        template(#header) {{ $t('devices.status') }}

          el-link(
            style="float: right"
            icon="el-icon-refresh"
            @click="getDetails")

        p(v-if="$store.getters.isOnuRegistered && macsNotEqual")
          b {{ $t('attention') }}!

          span Мак адрес в билинге не совпадает с мак адресом, полученным с OLT. Можно попробовать воспользоваться кнопкой ниже "Исправить".
            | Если и она не помогает, "ONU не найдена на OLT" то это значит что нет связи между ONU и OLT, и конфигурации этой ONU на OLT тоже нет.
            |              Так же можно проверить место на "глазе" olt, может он заполнен.

        el-row(
          type="flex"
          v-else-if="$store.getters.isOnuRegistered"
          v-loading="loading"
        )
          el-col(style="width: 128px;")
            i.icon-big(:class="iconStatusClass")

          el-col(v-if="onuDetails !== null")
            .text.item.list-item
              b {{ $t('devices.signalLevel') }}
              | {{ onuDetails.signal }}

            .text.item.list-item
              b {{ $t('devices.onuStateDescr') }}:
              |  {{ onuDetails.status }}

            .text.item.list-item
              b  {{ $t('macAddrFromOLT') }}
              | {{ macFromOlt }}

            template(v-for="(inf, i) in onuDetails.info" v-if="inf[1]")
              .text.item.list-item(:key="i")
                  b {{ inf[0] }}:&nbsp;
                  | {{ inf[1] || '-' }}

        el-row(v-else)
          el-col
            | Нет информации об ONU. (Поле "Доп. инфо для snmp" в форме редактирования устройства). Возможно, onu не зарегистрирована.

        fix-onu-btn(v-if="$store.getters.isOnuRegistered && macsNotEqual")

    el-col(:lg="12" :sm="24")
      onu-vlan-form(
        :disabled="$store.getters.isOnuRegistered && macsNotEqual"
        :style="{'margin-top': '5px'}"
        @update="refreshDev"
      )

    el-dialog(
      :visible.sync="devFormDialog"
      :title="$t('amendIt')"
      :close-on-click-modal="false")
      dev-form(v-on:done="devFrmDone")
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { IDevice, IOnuDetails, IOnuDetailsStatus } from '@/api/devices/types'
import { scanPonDetails } from '@/api/devices/req'
import { DeviceModule } from '@/store/modules/devices/device'
import DevForm from '@/views/devices/dev-form.vue'
import DeleteFromOltBtn from './epon-onu/delete-from-olt-btn.vue'
import OnuVlanForm from './onu-vlan-form.vue'
import FixOnuBtn from './fix-onu-btn.vue'

@Component({
  name: 'PonOnu',
  components: {
    DevForm,
    DeleteFromOltBtn,
    OnuVlanForm,
    FixOnuBtn
  }
})
export default class extends Vue {
  @Prop({ default: null }) private device!: IDevice | null
  private devFormDialog = false
  private onuDetails: IOnuDetails | null = null
  private loading = false

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
    if (this.onuDetails === null) return false
    return [IOnuDetailsStatus.WORKING, IOnuDetailsStatus.OK].includes(this.onuDetails.status)
  }

  get isStatusError() {
    return this.onuDetails !== null && !this.isStatusSuccess
  }

  get isStatusUnknown() {
    return !this.onuDetails || this.onuDetails.status === IOnuDetailsStatus.UNKNOWN
  }

  get macFromOlt(): string {
    return this.onuDetails ? this.onuDetails.mac : ''
  }

  private delDevice() {
    if (!this.device) return
    this.$confirm(`Действительно удалить onu "${this.device.comment}"?`).then(async() => {
      if (!this.device) {
        this.$message.error(this.$tc('notRemoved'))
        return
      }
      await DeviceModule.DelDevice(this.device.id)
      this.$message.success(this.$tc('deleted'))
      if (this.device.group && this.device.address) {
        this.$router.push({ name: 'devicesList', params: { addrId: this.device.address.toString() } })
      } else {
        this.$router.push('/devices')
      }
    })
  }

  private async getDetails() {
    if (this.device !== null) {
      this.loading = true
      try {
        const { data } = await scanPonDetails(this.device.id)
        this.onuDetails = data
      } finally {
        this.loading = false
      }
    }
  }

  private openDevForm() {
    this.devFormDialog = true
  }

  private devFrmDone() {
    this.devFormDialog = false
    this.$message.success(this.$tc('successfullyMaintained'))
    this.refreshDev()
    this.getDetails()
  }

  created() {
    this.getDetails()
  }

  private refreshDev() {
    this.$emit('reqrefresh')
  }

  get macsNotEqual() {
    return this.device && this.onuDetails ? this.device.mac_addr !== this.macFromOlt : false
  }
}
</script>

<style lang="scss">
.icon-big {
  font-size: 5rem;

  &.success {
    color: #3c763d;
  }

  &.error {
    color: #a94442;
  }
}
</style>
