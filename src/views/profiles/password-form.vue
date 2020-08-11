<template lang="pug">
  el-form(
    ref='form'
    size="mini"
    status-icon
    :rules="frmRules"
    :model="frmMod"
    v-loading="loading"
  )
    el-form-item(
      label="Новый пароль"
      prop='new_passw'
    )
      el-input(v-model="frmMod.new_passw" maxlength="128" type="password")
    el-form-item(
      label="Повтори пароль"
      prop='retype_passw'
    )
      el-input(v-model="frmMod.retype_passw" maxlength="128" type="password")
    el-form-item
      el-button-group
        el-button(type="primary" @click="onSubmit" icon="el-icon-download" size='small' :disabled="isEmpty") Сохранить
        el-button(@click="$emit('cancel')" icon="el-icon-delete" size='small') Отмена
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { UserProfileModule } from '@/store/modules/profiles/user-profile'
import { Form } from 'element-ui'
import { latinValidator } from '@/utils/validate'

@Component({
  name: 'PasswordForm'
})
export default class extends Vue {
  @Prop({ default: 0 }) private profileId!: number
  private loading = false

  private frmRules = {
    new_passw: [
      { required: true, message: 'Надо указать новый пароль', trigger: 'blur' },
      { validator: latinValidator, required: true, trigger: 'blur' },
      { min: 6, message: 'Пароль состоит минимум из 6ти символов' }
    ],
    retype_passw: [
      { required: true, trigger: 'blur', message: 'Нужно повторить новый пароль' },
      {
        validator: (rule: any, value: string, callback: Function) => {
          if (value === this.frmMod.new_passw) {
            callback()
          } else {
            callback(new Error(rule.message))
          }
        },
        message: 'Пароли должны совпадать'
      }
    ]
  }

  private frmMod = {
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
    (this.$refs['form'] as Form).validate(async valid => {
      if (valid) {
        this.loading = true
        const changedUser = UserProfileModule.PatchProfile({
          password: this.frmMod.retype_passw
        })
        this.loading = false
        this.$emit('done', changedUser)
      } else {
        this.$message.error('Исправь ошибки в форме')
      }
    })
  }
}
</script>
