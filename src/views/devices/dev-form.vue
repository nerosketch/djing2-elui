<template lang="pug">
  el-form(
    ref='form'
    status-icon
    :rules='frmRules'
    :model='frmMod'
    v-loading='isLoading'
  )
    el-form-item(
      label="IP Адрес"
      prop='ip_address'
    )
      el-input(v-model="frmMod.ip_address")
    el-form-item(
      label="Описание"
      prop='comment'
    )
      el-input(v-model="frmMod.comment")
    el-form-item(
      label="Тип устройства"
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
      label="MAC Адрес"
      prop='mac_addr'
    )
      el-input(v-model="frmMod.mac_addr")
    el-form-item(
      prop="is_noticeable"
    )
      el-checkbox(v-model="frmMod.is_management") Оповещать при событиях мониторинга&#58;
        b {{ frmMod.is_management ? 'Да' : 'Нет' }}
    el-form-item
      el-button(type="primary" @click="onSubmit" :loading="isLoading") Сохранить
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { ipAddrValidator, macAddrValidator } from '@/utils/validate'
import { IDevice, IDeviceTypeEnum } from '@/api/devices/types'
import { DeviceModule } from '@/store/modules/devices/device'

@Component({
  name: 'dev-form'
})
export default class extends Vue {
  private isLoading = false

  private frmRules = {
    ip_address: [
      { validator: ipAddrValidator, trigger: 'change', message: 'Пример ip: 192.168.0.23' }
    ],
    mac_addr: [
      { required: true, message: 'MAC не может быть пустым', trigger: 'blur' },
      { validator: macAddrValidator, trigger: 'change', message: 'Пример mac: 0a:0b:cc:dd::ee:ff' }
    ],
    comment: [
      { required: true, message: 'Укажите устройству какое-то имя', trigger: 'blur' }
    ]
  }

  private deviceTypeNames = [
    { nm: 'Не выбрано', v: IDeviceTypeEnum.UNKNOWN },
    { nm: 'Dlink DGS1100_10/ME', v: IDeviceTypeEnum.DlinkDGS1100_10ME },
    { nm: 'BDCOM P3310C', v: IDeviceTypeEnum.BDCOM_P3310C },
    { nm: 'EPON BDCOM FORA', v: IDeviceTypeEnum.EPON_BDCOM_FORA },
    { nm: 'Eltex Switch', v: IDeviceTypeEnum.EltexSwitch },
    { nm: 'ZTE C320', v: IDeviceTypeEnum.ZTE_C320 },
    { nm: 'Onu ZTE F660', v: IDeviceTypeEnum.OnuZTE_F660 },
    { nm: 'Onu ZTE F601', v: IDeviceTypeEnum.OnuZTE_F601 },
    { nm: 'Huawei S2300', v: IDeviceTypeEnum.HuaweiS2300 },
    { nm: 'Dlink DGS_3120_24SC', v: IDeviceTypeEnum.DlinkDGS_3120_24SCSwitchInterface },
    { nm: 'Dlink DGS_1100_06/ME', v: IDeviceTypeEnum.DlinkDGS_1100_06MESwitchInterface },
    { nm: 'Dlink DGS_3627G', v: IDeviceTypeEnum.DlinkDGS_3627GSwitchInterface }
  ]

  private frmMod: IDevice = {
    pk: DeviceModule.pk,
    ip_address: DeviceModule.ip_address,
    mac_addr: DeviceModule.mac_addr,
    comment: DeviceModule.comment,
    dev_type: DeviceModule.dev_type,
    dev_type_str: DeviceModule.dev_type_str,
    man_passw: DeviceModule.man_passw,
    group: DeviceModule.group,
    parent_dev: DeviceModule.parent_dev,
    snmp_extra: DeviceModule.snmp_extra,
    extra_data: DeviceModule.extra_data,
    vlans: DeviceModule.vlans,
    status: DeviceModule.status,
    is_noticeable: DeviceModule.is_noticeable
  }

  private onSubmit() {
    (this.$refs['form'] as Form).validate(async valid => {
      if (valid) {
        this.isLoading = true
        await DeviceModule.SET_ALL(this.frmMod)
        const newDat = await DeviceModule.SaveDevice()
        this.isLoading = false
        this.$emit('done', newDat)
      } else {
        this.$message.error('Исправьте ошибки в форме')
      }
    })
  }
}
</script>
