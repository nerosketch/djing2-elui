<template lang="pug">
  el-form(size="mini")
    el-form-item(
      label="Пароль"
      prop='password'
    )
      el-input(
        v-model="frmMod.password"
        maxlength="128"
        ref="passwinp"
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
        type="primary"
        @click="onSubmit"
        icon="el-icon-download"
        size='mini'
        :disabled="isEmpty"
        :loading="loading"
      ) Сохранить
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { changeCustomer } from '@/api/customers/req'

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

  get isEmpty() {
    return Boolean(!this.frmMod.password)
  }

  private async onSubmit() {
    try {
      this.loading = true
      const { data } = await changeCustomer(this.customerId, this.frmMod)
      this.$message.success('Пароль успешно обновлён')
      this.$emit('done', data)
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.loading = true
    }
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
