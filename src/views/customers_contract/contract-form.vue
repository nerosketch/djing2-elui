<template lang="pug">
  el-form(
    ref='frm'
    status-icon
    :rules='frmRules'
    :model='frmMod'
    v-loading='isLoading'
  )
    el-form-item(
      label="Номер договора"
      prop="contract_number"
    )
      el-input(v-model="frmMod.contract_number")
        template(#append)
          el-button(
            icon='el-icon-document'
            @click="doCopyFromUsername"
            title="Скопировать из логина абонента"
          )
    el-form-item(
      label="Дата начала действия договора"
      prop="start_service_time"
    )
      el-date-picker(
        v-model="frmMod.start_service_time"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="d.MM.yyyy HH:mm:ss"
      )
    el-form-item(
      label="Дата окончания действия договора"
    )
      el-date-picker(
        v-model="frmMod.end_service_time"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="d.MM.yyyy HH:mm:ss"
      )
    el-form-item(
      label="Активность"
    )
      el-checkbox(v-model="frmMod.is_active") - Действующий договор: {{ frmMod.is_active ? 'Да' : 'Нет' }}
    el-form-item(
      label="Доп. сведения"
    )
      el-input(v-model="frmMod.note" type="textarea" rows="5" cols="40")
    el-form-item
      el-button(
        type="primary" icon='el-icon-upload'
        @click="onSubmit"
        :loading="isLoading"
        :disabled="isFormUntouched"
        :type="isNew ? 'success' : 'default'"
      ) {{ isNew ? 'Добавить' : 'Сохранить' }}
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import FormMixin from '@/utils/forms'
import { ICustomer } from '@/api/customers/types'
import { ICustomerContract } from './api/types'
import { Form } from 'element-ui'
import { addContract, changeContract } from './api/reqs'

@Component({
  name: 'ContractForm'
})
export default class extends mixins(FormMixin) {
  @Prop({ default: null })
  private contract!: ICustomerContract | null

  private isLoading = false

  private frmMod: ICustomerContract = {
    id: undefined,
    customer: this.$store.state.customer.id,
    start_service_time: '',
    end_service_time: null,
    is_active: true,
    contract_number: '',
    note: ''
  }

  private fillFrmModFromVar(contract: ICustomerContract) {
    this.frmMod.id = contract.id
    this.frmMod.customer = contract.customer || this.$store.state.customer.id
    this.frmMod.start_service_time = contract.start_service_time
    this.frmMod.end_service_time = contract.end_service_time || null
    this.frmMod.is_active = contract.is_active
    this.frmMod.contract_number = contract.contract_number
    this.frmMod.note = contract.note
  }

  private frmRules = {
    contract_number: [
      { required: true, message: 'Номер договора обязателен', trigger: 'blur' },
    ],
    start_service_time: [
      { required: true, message: 'Нужно указать когда начал действовать договор', trigger: 'blur' },
    ]
  }

  @Watch('$store.state.customer', { deep: true })
  private onChanhedCustomer(customer: ICustomer) {
    this.frmInitial = Object.assign({}, customer)
  }

  @Watch('contract')
  private onChContract(contract: ICustomerContract) {
    this.fillFrmModFromVar(contract)
  }

  created() {
    if (this.contract) {
      this.fillFrmModFromVar(this.contract)
    }
  }

  private get isNew() {
    if (!this.contract) return true
    return this.contract.id === 0
  }

  private onSubmit() {
    (this.$refs.frm as Form).validate(async valid => {
      if (valid) {
        this.isLoading = true
        try {
          if (this.isNew) {
            const newDat = await addContract(this.frmMod)
            this.$emit('added', newDat)
            this.$message.success('Договор добавлен')
          } else {
            if (this.contract && this.contract.id) {
              const newDat = await changeContract(this.contract.id, this.frmMod)
              this.$emit('changed', newDat)
              this.$message.success('Договор сохранён')
            } else {
              const tx = 'Logic error on contractForm in onSubmit()'
              this.$message.error(tx)
              throw new Error(tx)
            }
          }
        } catch (err) {
          this.$message.error(err)
        } finally {
          this.isLoading = false
        }
      } else {
        this.$message.error('Исправь ошибки в форме')
      }
    })
  }

  private doCopyFromUsername() {
    this.frmMod.contract_number = this.$store.state.customer.username
  }
}
</script>
