<template lang="pug">
  el-form(
    ref='form'
    size="mini"
    status-icon
    :rules='frmRules'
    :model='frmMod'
    v-loading='isLoading'
  )
    el-form-item(
      label="Название"
      prop='title'
    )
      el-input(v-model="frmMod.title")
    el-form-item(
      label="IP адрес"
      prop='ip_address'
    )
      el-input(v-model="frmMod.ip_address")
    el-form-item(
      label="Порт"
      prop='ip_port'
    )
      el-input(v-model="frmMod.ip_port" type="number")
    el-form-item(
      label="Логин для входа"
      prop='auth_login'
    )
      el-input(v-model="frmMod.auth_login")
    el-form-item(
      label="Пароль для входа"
      prop='auth_passw'
    )
      el-input(v-model="frmMod.auth_passw")
    el-form-item(
      label="Тип NAS"
      prop='gw_type'
    )
      el-select(v-model="frmMod.gw_type" size='mini')
        el-option(label="Микротик" :value="0")
        el-option(label="Linux" :value="1")
    el-form-item(
      label="По умолчанию"
      prop='is_default'
    )
      el-checkbox(v-model="frmMod.is_default")
    el-form-item(
      label="Включен"
      prop='enabled'
    )
      el-checkbox(v-model="frmMod.enabled")
    el-form-item
      el-button(type="primary" @click="onSubmit" :loading="isLoading" :disabled="isFormUntouched") Сохранить
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { ipAddrValidator, latinValidator } from '@/utils/validate'
import FormMixin from '@/utils/forms'
import { Form } from 'element-ui'
import { GatewayModule } from '@/store/modules/gateways'

@Component({
  name: 'GwForm'
})
export default class extends mixins(FormMixin) {
  private isLoading = false

  private frmRules = {
    title: [
      { required: true, message: 'Название группы надо указать', trigger: 'blur' }
    ],
    ip_address: [
      { validator: ipAddrValidator, trigger: 'change', message: 'Не верный формат IPv4 адреса' }
    ],
    auth_login: [
      { validator: latinValidator, trigger: 'change', message: 'Только латиница' }
    ]
  }

  get onChId() {
    return GatewayModule.id
  }
  @Watch('onChId')
  private onChangeGroup() {
    this.frmMod.title = GatewayModule.title
    this.frmMod.ip_address = GatewayModule.ip_address
    this.frmMod.ip_port = GatewayModule.ip_port
    this.frmMod.auth_login = GatewayModule.auth_login
    this.frmMod.auth_passw = GatewayModule.auth_passw
    this.frmMod.gw_type = GatewayModule.gw_type
    this.frmMod.is_default = GatewayModule.is_default
    this.frmMod.enabled = GatewayModule.enabled
    this.frmInitial = Object.assign({}, this.frmMod)
  }

  private frmMod = {
    title: GatewayModule.title,
    ip_address: GatewayModule.ip_address,
    ip_port: GatewayModule.ip_port,
    auth_login: GatewayModule.auth_login,
    auth_passw: GatewayModule.auth_passw,
    gw_type: GatewayModule.gw_type,
    is_default: GatewayModule.is_default,
    enabled: GatewayModule.enabled
  }
  get isNew() {
    return GatewayModule.id === 0
  }

  created() {
    this.frmInitial = Object.assign({}, this.frmMod)
  }

  private onSubmit() {
    (this.$refs['form'] as Form).validate(async valid => {
      if (valid) {
        this.isLoading = true
        try {
          let newDat
          if (this.isNew) {
            newDat = await GatewayModule.AddGateway(this.frmMod)
          } else {
            newDat = await GatewayModule.PatchGateway(this.frmMod)
          }
          this.isLoading = false
          this.$emit('done', newDat)
        } catch (err) {
          this.isLoading = false
          this.$emit('err', err)
        }
      } else {
        this.$message.error('Исправь ошибки в форме')
      }
    })
  }
}
</script>
