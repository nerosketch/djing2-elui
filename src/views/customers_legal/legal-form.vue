<template lang="pug">
el-form(
  ref='frm'
  status-icon
  :rules="frmRules"
  :model="frmMod"
  v-loading='loading'
)
  el-form-item(
    label="Номер договора"
    prop='username'
  )
    el-input(
      v-model="frmMod.username"
    )
  el-form-item(
    label="Название"
    prop='title'
  )
    el-input(
      v-model="frmMod.title"
    )
  el-form-item(
    label='Описание'
  )
    el-input(
      type='textarea'
      rows='5'
      v-model="frmMod.description"
    )
  el-form-item
    el-button(
      icon='el-icon-upload'
      type="primary"
      @click="onSubmit"
      :disabled="!$perms.customers_legal.add_customerlegalmodel"
    ) Сохранить

</template>

<script lang="ts">
import { latinValidator } from '@/utils/validate'
import { Form } from 'element-ui'
import { Component, Vue } from 'vue-property-decorator'
import { CustomerLegalModule } from '@/store/modules/customers_legal/customer-legal'

@Component({
  name: 'LegalForm'
})
export default class extends Vue {
  public readonly $refs!: {
    frm: Form
  }

  private loading = false

  private frmMod = {
    title: '',
    description: ''
  }

  private frmRules = {
    username: [
      { required: true, message: 'Номер договора обязателен', trigger: 'blur' },
      { validator: latinValidator, trigger: 'change', message: 'Номер договора может содержать латинские символы и цифры' }
    ],
  }

  private get isNew() {
    return this.$store.state.customerlegal.id === 0
  }

  private onSubmit() {
    this.$refs.frm.validate(async valid => {
      if (valid) {
        this.loading = true
        try {
          if (this.isNew) {
            const newAccount = await CustomerLegalModule.addCustomerLegal(this.frmMod)
            this.$emit('added', newAccount)
          } else {
            const patchedAccount = await CustomerLegalModule.updateCustomerLegal(this.frmMod)
            this.$emit('update', patchedAccount)
          }
        } finally {
          this.loading = false
        }
      } else {
        this.$message.error('Исправь ошибки формы')
      }
    })
  }
}
</script>
