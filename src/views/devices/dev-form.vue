<template lang="pug">
  el-form(
    ref='form'
    label-width="150px"
    size="mini"
    status-icon
    :rules='frmRules'
    :model='frmMod'
    v-loading='loading'
  )
    el-form-item(
      label="IP Адрес"
      prop='ip_address'
    )
      el-input(v-model="frmMod.ip_address" size='mini')
    el-form-item(
      label="MAC Адрес"
      prop='mac_addr'
    )
      el-input(v-model="frmMod.mac_addr" size='mini')
    el-form-item(
      label="Описание"
      prop='comment'
    )
      el-input(v-model="frmMod.comment" size='mini')
    el-form-item(
      label="Тип устройства"
      prop='dev_type'
    )
      el-select(v-model="frmMod.dev_type" size='mini')
        el-option(
          v-for="dt in deviceTypeNames"
          :key="dt.v"
          :label="dt.nm"
          :value="dt.v"
        )
    el-form-item(
      label="SNMP Community"
      prop="man_passw"
    )
      el-input(v-model="frmMod.man_passw" size='mini')
    el-form-item(
      label="Группа"
      prop='group'
    )
      el-select(v-model="frmMod.group" size='mini')
        el-option(
          v-for="g in groups"
          :key="g.pk"
          :label="g.title"
          :value="g.pk"
        )
    el-form-item(
      label="Родит. устройство"
      prop="parent_dev"
    )
      device-autocomplete-field(v-model="frmMod.parent_dev" :defaultName="devParentName")
    el-form-item(
      label="Доп. инфо для snmp"
      prop="snmp_extra"
    )
      el-input(v-model="frmMod.snmp_extra" size='mini')
    el-form-item(
      prop="is_noticeable"
    )
      el-checkbox(v-model="frmMod.is_noticeable") Оповещать при событиях мониторинга&#58; 
        b {{ frmMod.is_noticeable ? 'Да' : 'Нет' }}
    el-form-item
      el-button(type="primary" @click="onSubmit" :loading="loading") Сохранить
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { ipAddrValidator, macAddrValidator } from '@/utils/validate'
import { IDevice, IDeviceTypeEnum } from '@/api/devices/types'
import { DeviceModule } from '@/store/modules/devices/device'
import { IGroup } from '@/api/groups/types'
import { getGroups } from '@/api/groups/req'
import DeviceAutocompleteField from '@/components/DeviceAutocompleteField/index.vue'

@Component({
  name: 'DevForm',
  components: {
    DeviceAutocompleteField
  }
})
export default class extends Vue {
  private loading = false
  private groups: IGroup[] = []

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

  private deviceTypeNames: {nm: string, v: IDeviceTypeEnum}[] = []

  private frmMod = this.devFrmData

  get devFrmData() {
    return {
      ip_address: DeviceModule.ip_address,
      mac_addr: DeviceModule.mac_addr,
      comment: DeviceModule.comment,
      dev_type: DeviceModule.dev_type,
      group: DeviceModule.group,
      is_noticeable: DeviceModule.is_noticeable,
      man_passw: DeviceModule.man_passw,
      parent_dev: DeviceModule.parent_dev,
      snmp_extra: DeviceModule.snmp_extra
    }
  }

  get devParentName() {
    return DeviceModule.parent_dev_name
  }

  get devId() {
    return DeviceModule.pk
  }
  @Watch('devId')
  private async onDevCh() {
    this.frmMod = this.devFrmData
  }

  private onSubmit() {
    (this.$refs['form'] as Form).validate(async valid => {
      if (valid) {
        this.loading = true
        const newDat = await DeviceModule.PatchDevice(this.frmMod)
        this.loading = false
        this.$emit('done', newDat.data)
      } else {
        this.$message.error('Исправь ошибки в форме')
      }
    })
  }

  created() {
    this.loadGroups().then(async () => {
      this.deviceTypeNames = await DeviceModule.getDeviceTypeNames()
    })
  }

  private async loadGroups() {
    const { data } = await getGroups({
      page: 1,
      page_size: 1000,
      fields: 'pk,title'
    })
    this.groups = data.results
  }
}
</script>
