<template lang="pug">
  el-form(
    ref='form'
    status-icon
    :rules='frmRules'
    :model='frmMod'
    v-loading='loading'
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
        :defaultName="$store.state.devicemodule.parent_dev_name"
      )
    el-form-item(
      label="Дата введения в эксплуатацию"
    )
      datetime-counter(
        v-model="frmMod.create_time"
      )
    el-form-item(
      label="Адрес"
    )
      addr-field-input(v-model="frmMod.address")
    el-form-item(
      label="№ дома"
    )
      el-input(v-model="frmMod.place" disabled readonly)
    el-form-item(
      label="Доп. инфо для snmp"
    )
      el-input(v-model="frmMod.snmp_extra")
    el-form-item(
      prop="is_noticeable"
    )
      el-checkbox(v-model="frmMod.is_noticeable") Оповещать при событиях мониторинга&#58;
        b {{ frmMod.is_noticeable ? 'Да' : 'Нет' }}
    el-form-item
      el-button(
        icon='el-icon-upload'
        type="primary" @click="onSubmit" :loading="loading"
        :disabled="isFormUntouched || !$perms.devices.change_device"
      ) Сохранить
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { mixins } from 'vue-class-component'
import { ipAddrValidator, macAddrValidator } from '@/utils/validate'
import { DeviceModule } from '@/store/modules/devices/device'
import DeviceAutocompleteField from '@/components/DeviceAutocompleteField/index.vue'
import FormMixin from '@/utils/forms'
import GroupsChoice from '@/components/Groups/groups-choice.vue'
import { IDeviceTypeName } from '@/api/devices/types'
import AddrFieldInput from '@/components/Address/addr-field-input/index.vue'
import DatetimeCounter from '@/components/datetime-counter.vue'

@Component({
  name: 'DevForm',
  components: {
    DeviceAutocompleteField,
    GroupsChoice,
    AddrFieldInput,
    DatetimeCounter
  }
})
export default class extends mixins(FormMixin) {
  @Prop({ default: null }) private addrId!: number | null

  private loading = DeviceModule.loadProgress

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
    ]
  }

  private deviceTypeNames: IDeviceTypeName[] = []

  private frmMod = this.devFrmData

  @Watch('$store.state.devicemodule.loadProgress')
  private onChLoading(l: boolean) {
    this.loading = l
  }

  get devFrmData() {
    const m = this.$store.state.devicemodule
    return {
      ip_address: m.ip_address,
      mac_addr: m.mac_addr,
      comment: m.comment,
      dev_type: m.dev_type,
      group: m.group,
      is_noticeable: m.is_noticeable,
      man_passw: m.man_passw,
      parent_dev: m.parent_dev,
      snmp_extra: m.snmp_extra,
      create_time: m.create_time,
      address: m.address,
      place: m.place
    }
  }

  @Watch('$store.state.devicemodule', { deep: true })
  private async onDevCh() {
    this.frmMod = this.devFrmData
    this.frmInitial = Object.assign({}, this.devFrmData)
  }

  @Watch('$store.state.devicemodule.snmp_extra')
  private async onChSnmp() {
    this.onDevCh()
  }

  private onSubmit() {
    (this.$refs.form as Form).validate(async valid => {
      if (valid) {
        this.loading = true
        try {
          const { data } = await DeviceModule.PatchDevice(this.frmMod)
          this.frmInitial = Object.assign({}, this.devFrmData)
          this.$emit('done', data)
        } finally {
          this.loading = false
        }
      } else {
        this.$message.error('Исправь ошибки в форме')
      }
    })
  }

  created() {
    DeviceModule.getDeviceTypeNames().then(d => {
      this.deviceTypeNames = d
    })
    this.frmInitial = Object.assign({}, this.frmMod)
  }
}
</script>
