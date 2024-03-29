<template lang="pug">
  el-form(
    ref="form"
    status-icon
    :rules="frmRules"
    :model="frmMod"
    v-loading="loading")
    el-form-item(
      :label="$t('oldPassword')"
      prop="old_passw"
      :error="frmErr.old_passw"
      v-if="!this.$perms.is_superuser")
      el-input(
        v-model="frmMod.old_passw"
        maxlength="128"
        type="password")

    el-form-item(
      :label="$t('newPassword')"
      prop="new_passw"
      :error="frmErr.new_passw")
      el-input(
        v-model="frmMod.new_passw"
        maxlength="128"
        type="password")

    el-form-item(
      :label="$t('repeatThePassword')"
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

        el-button(
          @click="$emit('cancel')"
          icon="el-icon-close"
        )
          | {{ $t('cancellation') }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { UserProfileModule } from '@/store/modules/profiles/user-profile'
import { Form } from 'element-ui'
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
      { required: !this.$perms.is_superuser, message: this.$tc('iNeedToPointOutTheOldPassword'), trigger: 'blur' },
      { min: 6, message: this.$tc('thePasswordConsistsOfAMinimumOf6Symbols') }
    ],
    new_passw: [
      { required: true, message: this.$tc('weNeedANewPassword'), trigger: 'blur' },
      { min: 6, message: this.$tc('thePasswordConsistsOfAMinimumOf6Symbols') }
    ],
    retype_passw: [
      { required: true, trigger: 'blur', message: this.$tc('weNeedANewPassword') },
      {
        validator: (rule: any, value: string, callback: Function) => {
          if (value === this.frmMod.new_passw) {
            callback()
          } else {
            callback(new Error(rule.message))
          }
        },
        message: this.$tc('thePasswordsShouldMatch')
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
        } catch (err: any) {
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
        this.$message.error(this.$tc('fixFormErrs'))
      }
    })
  }
}
</script>
