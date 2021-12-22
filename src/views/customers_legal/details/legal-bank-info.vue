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
      label="БИК"
      prop="bank_code"
    )
      el-input(
        v-model="frmMod.bank_code"
        type='number'
      )
    el-form-item(
      label="Корреспондентский счёт"
      prop="correspondent_account"
    )
      el-input(
        v-model="frmMod.correspondent_account"
      )
    el-form-item(
      label="Расчётный счёт"
      prop="settlement_account"
    )
      el-input(
        v-model="frmMod.settlement_account"
      )
    el-form-item
      el-button(
        icon="el-icon-upload"
        type='primary'
        @click="onSubmit"
      ) {{ $t('save') }}
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { CustomerLegalBankModule } from '@/store/modules/customers_legal/customer-legal-bank'
import { ICustomerLegalBank } from '@/api/customers_legal/types'
import { Form } from 'element-ui'

@Component({
  name: 'LegalBankInfo'
})
export default class extends Vue {
  @Prop({ required: true }) private uid!: number

  public readonly $refs!: {
    frm: Form
  }

  private loading = false

  private frmMod: {
    title: string,
    legal_customer: number,
    bank_code: string,
    correspondent_account: string,
    settlement_account: string
  } = {
    title: '',
    legal_customer: this.uid,
    bank_code: '',
    correspondent_account: '',
    settlement_account: ''
  }

  private frmRules = {
    title: [
      { required: true, message: 'Название банка обязательно', trigger: 'blur' },
    ],
    bank_code: [
      { required: true, message: 'Обязательно', trigger: 'blur' },
    ],
    correspondent_account: [
      { required: true, message: 'Обязательно', trigger: 'blur' },
    ],
    settlement_account: [
      { required: true, message: 'Обязательно', trigger: 'blur' },
    ]
  }

  private fillFrmMod(bank: ICustomerLegalBank) {
    this.frmMod.title = bank.title
    this.frmMod.bank_code = bank.bank_code
    this.frmMod.correspondent_account = bank.correspondent_account
    this.frmMod.settlement_account = bank.settlement_account
  }

  @Watch('$store.state.legalbank', { deep: true })
  private onChangeLegalBankInfo(bank: ICustomerLegalBank) {
    this.fillFrmMod(bank)
  }

  @Watch('uid')
  private onChUid(uid: number) {
    this.frmMod.legal_customer = uid
    CustomerLegalBankModule.getLegalBank(uid)
  }

  created() {
    if (this.uid) {
      this.frmMod.legal_customer = this.uid
      CustomerLegalBankModule.getLegalBank(this.uid)
    }
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
          this.$message.success(this.$t('saved'))
        } finally {
          this.loading = false
        }
      } else {
        this.$message.error(this.$t('fixFormErrs').toString())
      }
    })
  }

  private get isNew() {
    return !(this.$store.state.legalbank.id > 0)
  }
}
</script>
