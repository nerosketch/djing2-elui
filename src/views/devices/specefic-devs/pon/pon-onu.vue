<template>
  <el-row :gutter="5">
    <el-col :lg="12" :sm="24" v-if="device">
      <el-card shadow="never" body-style="padding: 10px;">
        <template v-slot:header>{{ `${device.comment} - ${device.dev_type_str || 'PON ONU'}` }} &nbsp;<small>{{ `${device.ip_address || device.mac_addr}` }}</small>
          <el-link style="float: right" icon="el-icon-edit" @click="openDevForm"></el-link>
        </template>
        <div class="text item list-item">{{ $t('ip-adres-device-ip_address-or-or', [device.ip_address || '-']) }}</div>
        <div class="text item list-item"><b>{{ $t('mak-1') }}</b> {{ device.mac_addr }}</div>
        <div class="text item list-item"><b>{{ $t('opisanie-2') }}</b> {{ device.comment }}</div>
        <div class="text item list-item"><b>{{ $t('roditelskoe-ustroistvo') }}</b>
          <router-link class="el-link el-link--primary is-underline" :to="{name: 'device-view', params: { devId: device.parent_dev }}">{{ $t('and-nbsp-device-parent_dev_name', [device.parent_dev_name]) }}</router-link>
        </div>
        <div class="text item list-item" v-if="device.iface_name"><b>{{ $t('interfeis') }}</b> {{ device.iface_name }}</div>
        <div class="text item list-item"><b>{{ $t('prikreplyonnye-abonenty') }}</b>
          <router-link class="el-link el-link--primary is-underline" v-for="(ab, i) in device.attached_users" :key="i" :to="{name: 'customerDetails', params:{ uid: ab.id }}">{{ $t('and-nbsp-ab-full_name', [ab.full_name]) }}</router-link>
        </div>
        <el-button-group>
          <delete-from-olt-btn :devId="device.id" v-on:done="getDetails"></delete-from-olt-btn>
          <el-button type="danger" icon="el-icon-delete" @click="delDevice" :disabled="!$perms.devices.delete_device">{{ $t('udalit') }}</el-button>
        </el-button-group>
      </el-card>
    </el-col>
    <el-col :lg="12" :sm="24">
      <el-card shadow="never" body-style="padding: 10px;">
        <template v-slot:header>{{ $t('sostoyanie-onu') }}
          <el-link style="float: right" icon="el-icon-refresh" @click="refreshDev"></el-link>
        </template>
        <p type="flex" v-if="$store.getters.isOnuRegistered && macsNotEqual"><b>{{ $t('attention') }}!</b><span>
             Мак адрес в билинге не совпадает с мак адресом, полученным с OLT. Можно попробовать воспользоваться кнопкой ниже "Исправить". Если и она не помогает, "ONU не найдена на OLT" то это значит что нет связи между ONU и OLT, и конфигурации этой ONU на OLT тоже нет.
             Так же можно проверить место на "глазе" olt, может он заполнен.</span></p>
        <el-row type="flex" v-else-if="$store.getters.isOnuRegistered">
          <el-col style="width: 128px;"><i class="icon-big" :class="iconStatusClass"></i></el-col>
          <el-col v-if="onuDetails !== null">
            <div class="text item list-item"><b>{{ $t('uroven-signala') }}</b> {{ onuDetails.signal }}</div>
            <div class="text item list-item"><b>{{ $t('mak-adres-s-olt') }}</b> {{ macFromOlt }}</div>
            <div class="text item list-item" v-for="(inf, i) in onuDetails.info" :key="i"><b>{{ $t('inf-0', [inf[0]]) }}</b> {{ inf[1] }}</div>
          </el-col>
        </el-row>
        <el-row v-else>
          <el-col>Нет информации об ONU. (Поле "Доп. инфо для snmp" в форме редактирования устройства). Возможно, onu не зарегистрирована.</el-col>
        </el-row>
        <fix-onu-btn v-if="$store.getters.isOnuRegistered && macsNotEqual"></fix-onu-btn>
      </el-card>
    </el-col>
    <el-col :lg="12" :sm="24">
      <onu-vlan-form :disabled="$store.getters.isOnuRegistered && macsNotEqual" :style="{'margin-top': '5px'}"></onu-vlan-form>
    </el-col>
    <el-dialog :visible.sync="devFormDialog" title="$t('izmenit-onu')" :close-on-click-modal="false">
      <dev-form v-on:done="devFrmDone"></dev-form>
    </el-dialog>
  </el-row>
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

  get macFromOlt(): string {
    return this.onuDetails ? this.onuDetails.mac : ''
  }

  private delDevice() {
    if (!this.device) return
    this.$confirm(`Действительно удалить onu "${this.device.comment}"?`).then(async() => {
      if (!this.device) {
        this.$message.error(this.$t('ne-udalili-pokhozhe-uzhe-kto-to-udalil'))
        return
      }
      await DeviceModule.DelDevice(this.device.id)
      this.$message.success(this.$t('udalena'))
      if (this.device.group) {
        this.$router.push({ name: 'devicesList', params: { addrId: this.device.address.toString() } })
      } else {
        this.$router.push('/devices')
      }
    })
  }

  private async getDetails() {
    if (this.device !== null) {
      const { data } = await scanPonDetails(this.device.id)
      this.onuDetails = data
    }
  }

  private openDevForm() {
    this.devFormDialog = true
  }

  private devFrmDone() {
    this.devFormDialog = false
    this.$message.success(this.$t('uspeshno-sokhraneno'))
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
