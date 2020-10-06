<template lang="pug">
  el-row(:gutter='5')
    el-col(:span='24')
      el-alert(
        v-if="macsNotEqual"
        title="Внимание!"
        description='Мак адрес в билинге не совпадает на мак адресом, полученным с OLT. Нужно обновить "Доп. инфо для snmp". Или нажмите кнопку "Исправить ниже"'
        type="warning"
        effect="dark"
        show-icon
        center
      )
    el-col(:lg="12" :sm='24' v-if="device")
      el-card(
        shadow="never"
        body-style="padding: 10px;"
      )
        template(v-slot:header) {{ `${device.comment} - ${device.dev_type_str || 'PON ONU'}` }} &nbsp;
          small {{ `${device.ip_address || device.mac_addr}` }}
          el-link(style="float: right" icon='el-icon-edit' @click="openDevForm")
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
        .text.item.list-item(v-if="device.iface_name")
          b Интерфейс: 
          | {{ device.iface_name }}
        .text.item.list-item
          b Прикреплённые абоненты: 
          el-link(type="primary" v-for="(ab, i) in device.attached_users" :key="i")
            router-link(:to="{name: 'customerDetails', params:{ uid: ab.pk }}") {{ ab.full_name }}
        el-button-group
          delete-from-olt-btn(:devId="device.pk" v-on:done="getDetails")
          el-button(
            type="danger" icon="el-icon-delete" size="mini"
            @click="delDevice"
            :disabled="!$perms.devices.delete_device"
          ) Удалить

    el-col(:lg="12" :sm='24')
      el-card(
        shadow="never"
        body-style="padding: 10px;"
      )
        template(v-slot:header) Состояние ONU
          el-link(style="float: right" icon='el-icon-refresh' @click="refreshDev")
        el-row(type='flex' v-if="isOnuRegistered")
          el-col(style='width: 128px;')
            i.icon-big(:class="iconStatusClass")
          el-col(v-if="onuDetails !== null")
            .text.item.list-item
              b Уровень сигнала: 
              | {{ onuDetails.signal }}
            .text.item.list-item
              b Мак адрес с OLT: 
              | {{ macFromOlt }}
            .text.item.list-item(v-for="(inf, i) in onuDetails.info" :key="i")
              b {{ inf[0] }}: 
              | {{ inf[1] }}
        el-row(v-else)
          el-col
            b ONU не зарегистрирована
        fix-onu-btn(v-if="macsNotEqual")

    el-col(:lg="12" :sm='24')
      onu-vlan-form(:style="{'margin-top': '5px'}")

    el-dialog(
      :visible.sync="devFormDialog"
      title="Изменить ONU"
    )
      dev-form(
        v-on:done="devFrmDone"
      )
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { IDevice, IOnuDetails, IOnuDetailsStatus } from '@/api/devices/types'
import { scanPonDetails } from '@/api/devices/req'
import { DeviceModule } from '@/store/modules/devices/device'
import DevForm from '../dev-form.vue'
import DeleteFromOltBtn from '@/views/devices/specefic-devs/epon-onu/delete-from-olt-btn.vue'
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

  get isOnuRegistered() {
    return DeviceModule.isOnuRegistered
  }

  get macFromOlt(): string {
    return this.onuDetails ? this.onuDetails.mac : ''
  }

  private delDevice() {
    if (!this.device) return
    this.$confirm(`Действительно удалить onu "${this.device.comment}"?`).then(async() => {
      if (!this.device) {
        this.$message.error('Не удалили, похоже уже кто-то удалил')
        return
      }
      await DeviceModule.DelDevice(this.device.pk)
      this.$message.success('Удалена')
      if (this.device.group) {
        this.$router.push({ name: 'devicesList', params: { groupId: this.device.group.toString() } })
      } else {
        this.$router.push('/devices')
      }
    })
  }

  private async getDetails() {
    if (this.device !== null) {
      const { data } = await scanPonDetails(this.device.pk)
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

  get macsNotEqual(): boolean {
    return this.device && this.onuDetails ? this.device.mac_addr !== this.macFromOlt : false
  }

  get snmpGetter() {
    return DeviceModule.snmp_extra
  }
  @Watch('snmpGetter')
  private onDevChanged() {
    this.getDetails()
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
