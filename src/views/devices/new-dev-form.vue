<template lang="pug">
  el-form(
    ref='form'
    status-icon
    :rules="frmRules"
    :model="frmMod"
    v-loading="loading"
  )
    el-form-item(
      label="IP Адрес"
      prop='ip_address'
    )
      el-input(v-model="frmMod.ip_address")
    el-form-item(
      label="MAC Адрес"
      prop='mac_addr'
    )
      el-input(v-model="frmMod.mac_addr")
    el-form-item(
      label="Описание"
      prop='comment'
    )
      el-input(v-model="frmMod.comment")
    el-form-item(
      label="Тип оборудования"
      prop='dev_type'
    )
      el-select(v-model="frmMod.dev_type")
        el-option(
          v-for="dt in deviceTypeNames"
          :key="dt.v"
          :label="dt.nm"
          :value="dt.v"
        )
    el-form-item(
      label="SNMP Community"
    )
      el-input(v-model="frmMod.man_passw")
    el-form-item(
      label="Группа"
    )
      groups-choice(v-model="frmMod.group")
    el-form-item(
      label="Родит. устройство"
    )
      device-autocomplete-field(
        v-model="frmMod.parent_dev"
        :defaultName="initialParentDevName"
      )
    el-form-item(
      label="Дата введения в эксплуатацию"
    )
      el-date-picker(
        v-model="frmMod.create_time"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm"
        format="d.MM.yyyy HH:mm"
      )
    el-form-item(
      label="Локация"
    )
      locality-choice(v-model="frmMod.locality")
    el-form-item(
      label="Улица"
    )
      locality-street-choice(
        :localityId='frmMod.locality'
        v-model='frmMod.street'
      )
    el-form-item(
      label="№ дома"
    )
      el-input(v-model="frmMod.place")
    el-form-item(
      label="Доп. инфо для snmp"
    )
      el-input(v-model="frmMod.snmp_extra")
    el-form-item
      el-checkbox(v-model="frmMod.is_noticeable") Оповещать при событиях мониторинга&#58;
        b {{ frmMod.is_noticeable ? 'Да' : 'Нет' }}
    el-form-item
      el-button(
        type="success" @click="onSubmit" icon="el-icon-plus"
        :loading="loading"
        :disabled="!$perms.devices.add_device"
      ) Добавить
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { ipAddrValidator, macAddrValidator, positiveNumberValueAvailable } from '@/utils/validate'
import { DeviceModule, IDeviceTypeName } from '@/store/modules/devices/device'
import DeviceAutocompleteField from '@/components/DeviceAutocompleteField/index.vue'
import dateCounter from '@/utils/date-counter'
import GroupsChoice from '@/views/groups/groups-choice.vue'
import LocalityStreetChoice from '@/components/Locality/street-choice.vue'
import LocalityChoice from '@/components/Locality/locality-choice.vue'

@Component({
  name: 'NewDevForm',
  components: {
    DeviceAutocompleteField,
    GroupsChoice,
    LocalityStreetChoice,
    LocalityChoice
  }
})
export default class extends Vue {
  @Prop({ default: '' }) private initialIp!: string
  @Prop({ default: '' }) private initialMac!: string
  @Prop({ default: '' }) private initialComment!: string
  @Prop({ default: 0 }) private initialDevType!: number
  @Prop({ default: 0 }) private initialGroup!: number
  @Prop({ default: 0 }) private initialLocality!: number
  @Prop({ default: false }) private initialIsNotic!: boolean
  @Prop({ default: 'ertNjuWr' }) private initialManPassw!: string
  @Prop({ default: '' }) private initialSnmpSxtra!: string
  @Prop({ default: 0 }) private initialParentDev!: number
  @Prop({ default: '' }) private initialParentDevName!: string

  private loading = false

  private frmRules = {
    ip_address: [
      { validator: ipAddrValidator, trigger: 'change', message: 'Пример ip: 192.168.0.23' }
    ],
    mac_addr: [
      { required: true, message: 'MAC не может быть пустым', trigger: 'blur' },
      { validator: macAddrValidator, trigger: 'change', message: 'Пример mac: 0a:0b:cc:dd::ee:ff' }
    ],
    comment: [
      { required: true, message: 'Укажи устройству какое-то имя', trigger: 'blur' }
    ],
    dev_type: [
      { validator: positiveNumberValueAvailable, trigger: 'change', message: 'Нужно указать тип устройства' }
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
    locality: this.initialLocality,
    street: 0,
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
        this.$message.error('Исправь ошибки в форме')
      }
    })
  }

  private localTimer?: number

  created() {
    DeviceModule.getDeviceTypeNames().then(d => {
      this.deviceTypeNames = d
    })
    this.localTimer = dateCounter(this.frmMod, 'create_time')
  }

  beforeDestroy() {
    if (this.localTimer) {
      clearInterval(this.localTimer)
    }
  }
}
</script>
