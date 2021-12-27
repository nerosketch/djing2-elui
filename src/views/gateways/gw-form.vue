<template lang="pug">
  el-form(
    ref="form"
    status-icon
    :rules="frmRules"
    :model="frmMod"
    v-loading="isLoading")
    el-form-item(:label="$t('title')", prop="title")
      el-input(v-model="frmMod.title")

    el-form-item(:label="$t('ipAddress')", prop="ip_address")
      el-input(v-model="frmMod.ip_address")

    el-form-item(:label="$t('gateways.port')")
      el-input(v-model="frmMod.ip_port", type="number")

    el-form-item(:label="$t('inletLogin')", prop="auth_login")
      el-input(v-model="frmMod.auth_login")

    el-form-item(:label="$t('inletPassword')")
      el-input(v-model="frmMod.auth_passw")

    el-form-item(:label="$t('likeUs')")
      el-select(v-model="frmMod.gw_type")
        el-option(:label="$t('mikrotik')", :value="0")

        el-option(label="Linux", :value="1")

    el-form-item(:label="$t('default')")
      el-checkbox(v-model="frmMod.is_default")

    el-form-item(:label="$t('included')")
      el-checkbox(v-model="frmMod.enabled")

    el-form-item(:label="$t('classOfLock')")
      el-select(v-model="frmMod.gw_class")
        el-option(
          v-for="(gwc, i) in gwClassChoices"
          :key="i"
          :value="gwc.v"
          :label="gwc.t")

    el-form-item(:label="$t('addressOfInstallation')")
      el-input(v-model="frmMod.place")

    el-form-item
      el-button(
        icon="el-icon-upload"
        type="primary"
        @click="onSubmit"
        :loading="isLoading"
        :disabled="isFormUntouched")
        | {{ $t('save') }}
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { ipAddrValidator, latinValidator } from '@/utils/validate'
import FormMixin from '@/utils/forms'
import { Form } from 'element-ui'
import { GatewayModule } from '@/store/modules/gateways'
import { IGatewayClassChoiceType } from '@/api/gateways/types'
import { getGwClassChoices } from '@/api/gateways/req'

@Component({
  name: 'GwForm'
})
export default class extends mixins(FormMixin) {
  private isLoading = false

  private frmRules = {
    title: [
      {
        required: true,
        message: this.$t('groups.group_required'),
        trigger: 'blur'
      }
    ],
    ip_address: [
      { validator: ipAddrValidator, trigger: 'change', message: this.$t('gateways.wrong_format_ipv4') }
    ],
    auth_login: [
      { validator: latinValidator, trigger: 'change', message: this.$t('justLatin') }
    ]
  }

  private gwClassChoices: IGatewayClassChoiceType[] = []

  @Watch('$store.state.gateway.id')
  private onChangeGroup() {
    this.frmMod.title = GatewayModule.title
    this.frmMod.ip_address = GatewayModule.ip_address
    this.frmMod.ip_port = GatewayModule.ip_port
    this.frmMod.auth_login = GatewayModule.auth_login
    this.frmMod.auth_passw = GatewayModule.auth_passw
    this.frmMod.gw_type = GatewayModule.gw_type
    this.frmMod.gw_class = GatewayModule.gw_class
    this.frmMod.is_default = GatewayModule.is_default
    this.frmMod.enabled = GatewayModule.enabled
    this.frmMod.place = GatewayModule.place
    this.frmInitial = Object.assign({}, this.frmMod)
  }

  private frmMod = {
    title: GatewayModule.title,
    ip_address: GatewayModule.ip_address,
    ip_port: GatewayModule.ip_port,
    auth_login: GatewayModule.auth_login,
    auth_passw: GatewayModule.auth_passw,
    gw_type: GatewayModule.gw_type,
    gw_class: GatewayModule.gw_class,
    is_default: GatewayModule.is_default,
    enabled: GatewayModule.enabled,
    place: GatewayModule.place
  }

  get isNew() {
    return GatewayModule.id === 0
  }

  created() {
    this.frmInitial = Object.assign({}, this.frmMod)
    this.loadGwClassChoices()
  }

  private onSubmit() {
    (this.$refs.form as Form).validate(async valid => {
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
        this.$message.error(this.$t('fixFormErrs').toString())
      }
    })
  }

  private async loadGwClassChoices() {
    const { data } = await getGwClassChoices()
    this.gwClassChoices = data
  }
}
</script>
