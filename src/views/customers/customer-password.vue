<template lang="pug">
  el-form
    el-form-item(:label="$t('customers.password')" prop="password")
      el-input(
        v-model="frmMod.password"
        maxlength="128"
        :type="passwordType"
        :placeholder="$t('customers.passwordLong')")
        template(v-slot:append)
          el-button(@click="togglePwd", :icon="passwordType === 'password' ? 'el-icon-view' : 'el-icon-minus'")

          el-button(
            @click="genPasw"
            :loading="passwLoading"
            icon="el-icon-refresh")

    el-form-item
      el-button(
        type="primary"
        @click="onSubmit"
        icon="el-icon-upload"
        :disabled="isEmpty"
        :loading="loading")
        | {{ $t('save') }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { changeCustomer, generateCustomerPassword } from '@/api/customers/req'

@Component({
  name: 'CustomerPassword'
})
export default class extends Vue {
  @Prop({ default: '' }) private initialPassw!: string
  @Prop({ required: true }) private customerId!: number
  private passwordType = 'password'
  private loading = false
  private passwLoading = false

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
      this.$message.success(
        this.$tc('customers.passwordUpdateOk').toString()
      )
      this.$emit('done', data)
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.loading = false
    }
  }

  private togglePwd() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text'
    } else {
      this.passwordType = 'password'
    }
  }

  private async genPasw() {
    this.passwLoading = true
    try {
      const { data } = await generateCustomerPassword()
      this.frmMod.password = data
    } catch (err) {
      this.$message.error(err)
      this.frmMod.password = ''
    } finally {
      this.passwLoading = false
    }
  }
}
</script>
