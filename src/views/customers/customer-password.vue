<template lang="pug">
  el-form(
    ref='passwfrm'
    size='mini'
    :rules='frmRules'
    status-icon
    :model='frmMod'
  )
    el-form-item(
      label="Пароль"
      prop='password'
    )
      el-input(
        v-model="frmMod.password"
        maxlength="128"
        :type="passwordType"
        placeholder="пароль"
      )
        template(v-slot:append)
          el-button(
            @click="togglePwd"
            :icon="passwordType === 'password' ? 'el-icon-view' : 'el-icon-minus'"
          )

    el-form-item
      el-button(
        type='primary'
        @click="onSubmit"
        icon='el-icon-upload'
        size='mini'
        :disabled='isEmpty'
        :loading="loading"
      ) Сохранить
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { changeCustomer } from '@/api/customers/req'
import { regexpVal } from '@/utils/validate'

@Component({
  name: 'CustomerPassword'
})
export default class extends Vue {
  @Prop({ default: '' }) private initialPassw!: string
  @Prop({ required: true }) private customerId!: number
  private passwordType = 'password'
  private loading = false

  private frmMod = {
    password: this.initialPassw
  }

  private frmRules = {
    password: [
      { required: true, message: 'Пароль абонента обязателен', trigger: 'blur' },
      {
        validator: regexpVal(/^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/i),
        trigger: 'change',
        message: 'Минимум 8 символов, 1 символ в нижнем регистре, 1 в верхнем, 1 число, 1 спец символ !@#$%^&*'
      }
    ]
  }

  get isEmpty() {
    return Boolean(!this.frmMod.password)
  }

  private onSubmit() {
    (this.$refs['passwfrm'] as Form).validate(async valid => {
      if (valid) {
        try {
          this.loading = true
          const { data } = await changeCustomer(this.customerId, this.frmMod)
          this.$message.success('Пароль успешно обновлён')
          this.$emit('done', data)
        } catch (err) {
          this.$message.error(err)
        } finally {
          this.loading = false
        }
      } else {
        this.$message.error('Исправь ошибки')
      }
    })
  }

  private togglePwd() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text'
    } else {
      this.passwordType = 'password'
    }
  }
}
</script>
