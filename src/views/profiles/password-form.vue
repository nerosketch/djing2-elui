<template lang="pug">
  el-form(
    ref="form"
    status-icon
    :rules="frmRules"
    :model="frmMod"
    v-loading="loading")
    el-form-item(
      :label="$t('staryi-parol')"
      prop="old_passw"
      :error="frmErr.old_passw"
      v-if="!this.$perms.is_superuser")
      el-input(
        v-model="frmMod.old_passw"
        maxlength="128"
        type="password")
  
    el-form-item(
      :label="$t('novyi-parol')"
      prop="new_passw"
      :error="frmErr.new_passw")
      el-input(
        v-model="frmMod.new_passw"
        maxlength="128"
        type="password")
  
    el-form-item(
      :label="$t('povtori-parol')"
      prop="retype_passw"
      :error="frmErr.retype_passw")
      el-input(
        v-model="frmMod.retype_passw"
        maxlength="128"
        type="password")
  
    el-form-item
      el-button-group
        el-button(
          type="primary"
          @click="onSubmit"
          icon="el-icon-download"
          :disabled="isEmpty")
          | {{ $t('save') }}
      
        el-button(@click="$emit('cancel')", icon="el-icon-close")
          | {{ $t('otmena') }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { UserProfileModule } from '@/store/modules/profiles/user-profile'
import { Form } from 'element-ui'
import { latinValidator } from '@/utils/validate'
import { CurrentPermissions } from '@/store/current-user-permissions'

@Component({
  name: 'PasswordForm'
})
export default class extends Vue {
  private $perms!: CurrentPermissions
  @Prop({ default: 0 }) private profileId!: number
  private loading = false

  private frmRules = {
    old_passw: [
      { required: !this.$perms.is_superuser, message: this.$t('nado-ukazat-staryi-parol'), trigger: 'blur' },
      { validator: latinValidator, required: true, trigger: 'blur' },
      { min: 6, message: this.$t('parol-sostoit-minimum-iz-6ti-simvolov-0') }
    ],
    new_passw: [
      { required: true, message: this.$t('nado-ukazat-novyi-parol'), trigger: 'blur' },
      { validator: latinValidator, required: true, trigger: 'blur' },
      { min: 6, message: this.$t('parol-sostoit-minimum-iz-6ti-simvolov-1') }
    ],
    retype_passw: [
      { required: true, trigger: 'blur', message: this.$t('nuzhno-povtorit-novyi-parol') },
      {
        validator: (rule: any, value: string, callback: Function) => {
          if (value === this.frmMod.new_passw) {
            callback()
          } else {
            callback(new Error(rule.message))
          }
        },
        message: this.$t('paroli-dolzhny-sovpadat')
      }
    ]
  }

  private frmMod = {
    old_passw: this.$perms.is_superuser ? '0' : '',
    new_passw: '',
    retype_passw: ''
  }

  private frmErr = {
    old_passw: '',
    new_passw: '',
    retype_passw: ''
  }

  private get isEmpty() {
    if (!this.frmMod.new_passw || !this.frmMod.retype_passw) {
      return true
    }
    return this.frmMod.new_passw !== this.frmMod.retype_passw
  }

  private onSubmit() {
    (this.$refs.form as Form).validate(async valid => {
      if (valid) {
        this.loading = true
        try {
          const changedUser = await UserProfileModule.PatchPassword({
            old_passw: this.frmMod.old_passw,
            new_passw: this.frmMod.retype_passw
          })
          this.$emit('done', changedUser)
        } catch (err) {
          if (typeof err === 'object' && err.hasOwnProperty('response')) {
            const d = err.response.data
            this.frmErr.old_passw = d.old_passw
            this.frmErr.new_passw = d.new_passw
            this.frmErr.retype_passw = d.retype_passw
          }
        } finally {
          this.loading = false
        }
      } else {
        this.$message.error(this.$t('fixFormErrs').toString())
      }
    })
  }
}
</script>
