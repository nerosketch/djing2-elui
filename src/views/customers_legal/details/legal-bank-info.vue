<template lang="pug">
  el-form(
    ref='frm'
    status-icon
    :rules="frmRules"
    :model="frmMod"
    v-loading="loading"
  )
    el-form-item(
      label="Название банка"
      prop="title"
    )
      el-input(
        v-model="frmMod.title"
      )
    el-form-item(
      label="Почтовый индекс почтового адреса абонента"
      prop="post_index"
    )
      el-input(
        v-model="frmMod.post_index"
      )
    el-form-item(
      label="Номер банковского счёта"
      prop="number"
    )
      el-input(
        v-model="frmMod.number"
      )
    el-form-item(
      label="БИК"
    )
      el-input(
        v-model="frmMod.bank_code"
      )
    el-form-item(
      label="Корреспондентский счёт"
    )
      el-input(
        v-model="frmMod.correspondent_account"
      )
    el-form-item(
      label="Расчётный счёт"
    )
      el-input(
        v-model="frmMod.settlement_account"
      )
    el-form-item
      el-button(
        icon="el-icon-upload"
        type='primary'
        @click="onSubmit"
      ) Сохранить
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { CustomerLegalBankModule } from '@/store/modules/customers_legal/customer-legal-bank'
import { ICustomerLegalBank } from '@/api/customers_legal/types'
import { Form } from 'element-ui'

@Component({
  name: 'LegalBankInfo'
})
export default class extends Vue {
  public readonly $refs!: {
    frm: Form
  }

  private loading = false

  private frmMod = {
    title: '',
    post_index: '',
    number: '',
    bank_code: '',
    correspondent_account: '',
    settlement_account: ''
  }

  private frmRules = {
    title: [
      { required: true, message: 'Название банка обязательно', trigger: 'blur' },
    ],
    post_index: [
      { required: true, message: 'Обязательно', trigger: 'blur' },
    ],
    number: [
      { required: true, message: 'Обязательно', trigger: 'blur' },
    ]
  }

  private fillFrmMod(bank: ICustomerLegalBank) {
    this.frmMod.title = bank.title
    this.frmMod.post_index = bank.post_index
    this.frmMod.number = bank.number
    this.frmMod.bank_code = bank.bank_code
    this.frmMod.correspondent_account = bank.correspondent_account
    this.frmMod.settlement_account = bank.settlement_account
  }

  created() {
    this.fillFrmMod(this.$store.state.legalbank)
  }

  @Watch('$store.state.legalbank', { deep: true })
  private onChangeLegalBankInfo(bank: ICustomerLegalBank) {
    this.fillFrmMod(bank)
  }

  private onSubmit() {
    this.$refs.frm.validate(async valid => {
      if (valid) {
        this.loading = true
        try {
          if (this.isNew) {
            await CustomerLegalBankModule.addLegalBank(this.frmMod)
          } else {
            await CustomerLegalBankModule.updateLegalBank(this.frmMod)
          }
          this.$message.success('Сохранено')
        } finally {
          this.loading = false
        }
      } else {
        this.$message.error('Исправь ошибки в форме')
      }
    })
  }

  private get isNew() {
    return !Boolean(this.$store.state.legalbank.id)
  }
}
</script>
