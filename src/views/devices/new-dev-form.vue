<template>
  <el-form ref="form" status-icon :rules="frmRules" :model="frmMod" v-loading="loading">
    <el-form-item :label="$t('ipAddress')" prop="ip_address">
      <el-input v-model="frmMod.ip_address"></el-input>
    </el-form-item>
    <el-form-item :label="$t('macAddress')" prop="mac_addr">
      <el-input v-model="frmMod.mac_addr"></el-input>
    </el-form-item>
    <el-form-item label="$t('opisanie-1')" prop="comment">
      <el-input v-model="frmMod.comment"></el-input>
    </el-form-item>
    <el-form-item label="$t('tip-oborudovaniya-0')" prop="dev_type">
      <el-select v-model="frmMod.dev_type">
        <el-option v-for="dt in deviceTypeNames" :key="dt.v" :label="dt.nm" :value="dt.v"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="$t('snmp-community-0')">
      <el-input v-model="frmMod.man_passw"></el-input>
    </el-form-item>
    <el-form-item label="$t('gruppa-1')">
      <groups-choice v-model="frmMod.group"></groups-choice>
    </el-form-item>
    <el-form-item label="$t('rodit-ustroistvo-0')">
      <device-autocomplete-field v-model="frmMod.parent_dev" :defaultName="initialParentDevName"></device-autocomplete-field>
    </el-form-item>
    <el-form-item label="$t('data-vvedeniya-v-ekspluataciyu-1')">
      <datetime-counter v-model="frmMod.create_time"></datetime-counter>
    </el-form-item>
    <el-form-item label="$t('dop-info-dlya-snmp-0')">
      <el-input v-model="frmMod.snmp_extra"></el-input>
    </el-form-item>
    <el-form-item>
      <el-checkbox v-model="frmMod.is_noticeable">{{ $t('opoveshat-pri-sobytiyakh-monitoringa-0') }}&#58;<b>{{ frmMod.is_noticeable ? 'Да' : 'Нет' }}</b></el-checkbox>
    </el-form-item>
    <el-form-item>
      <el-button type="success" @click="onSubmit" icon="el-icon-plus" :loading="loading" :disabled="!$perms.devices.add_device">{{ $t('add') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { ipAddrValidator, macAddrValidator, positiveNumberValueAvailable } from '@/utils/validate'
import { DeviceModule } from '@/store/modules/devices/device'
import DeviceAutocompleteField from '@/components/DeviceAutocompleteField/index.vue'
import GroupsChoice from '@/components/Groups/groups-choice.vue'
import { IDeviceTypeName } from '@/api/devices/types'
import DatetimeCounter from '@/components/datetime-counter.vue'

@Component({
  name: 'NewDevForm',
  components: {
    DeviceAutocompleteField,
    GroupsChoice,
    DatetimeCounter
  }
})
export default class extends Vue {
  @Prop({ default: '' }) private initialIp!: string
  @Prop({ default: '' }) private initialMac!: string
  @Prop({ default: '' }) private initialComment!: string
  @Prop({ default: 0 }) private initialDevType!: number
  @Prop({ default: 0 }) private initialGroup!: number
  @Prop({ default: null }) private initialAddress!: number | null
  @Prop({ default: false }) private initialIsNotic!: boolean
  @Prop({ default: 'ertNjuWr' }) private initialManPassw!: string
  @Prop({ default: '' }) private initialSnmpSxtra!: string
  @Prop({ default: 0 }) private initialParentDev!: number
  @Prop({ default: '' }) private initialParentDevName!: string

  private loading = false

  private frmRules = {
    ip_address: [
      { validator: ipAddrValidator, trigger: 'change', message: this.$t('primer-ip-192-168-0-23-0') }
    ],
    mac_addr: [
      { required: true, message: this.$t('mac-ne-mozhet-byt-pustym-0'), trigger: 'blur' },
      { validator: macAddrValidator, trigger: 'change', message: this.$t('primer-mac-0a-0b-cc-dd-ee-ff-0') }
    ],
    comment: [
      { required: true, message: this.$t('ukazhi-ustroistvu-kakoe-to-imya-0'), trigger: 'blur' }
    ],
    dev_type: [
      { validator: positiveNumberValueAvailable, trigger: 'change', message: this.$t('nuzhno-ukazat-tip-ustroistva') }
    ]
  }

  private deviceTypeNames: IDeviceTypeName[] = []

  private frmMod = {
    ip_address: this.initialIp || null,
    mac_addr: this.initialMac,
    comment: this.initialComment,
    dev_type: this.initialDevType,
    group: this.initialGroup,
    is_noticeable: this.initialIsNotic,
    man_passw: this.initialManPassw,
    parent_dev: this.initialParentDev,
    snmp_extra: this.initialSnmpSxtra,
    create_time: '',
    address: this.initialAddress,
    place: ''
  }

  private onSubmit() {
    (this.$refs.form as Form).validate(async valid => {
      if (valid) {
        this.loading = true
        try {
          const newDat = await DeviceModule.AddDevice(this.frmMod)
          if (newDat !== undefined) {
            this.loading = false
            this.$emit('done', newDat)
          }
        } catch (err) {
          this.loading = false
          this.$emit('err', err)
        }
      } else {
        this.$message.error(this.$t('fixFormErrs').toString())
      }
    })
  }

  created() {
    DeviceModule.getDeviceTypeNames().then(d => {
      this.deviceTypeNames = d
    })
  }
}
</script>
