<template lang="pug">
  el-form(
    ref="frm"
    status-icon
    :rules="frmRules"
    :model="frmMod"
    v-loading="isLoading")

    el-alert(
      v-if="isNew"
      title="Внимание на дату начала действия договора"
      description="После её создания нельзя будет эту дату изменить. Так что у вас ОДНА попытка, удачи :)"
      type="info"
      show-icon
    )
    el-form-item(:label="$t('title')")
      el-input(v-model="frmMod.title")

    el-form-item(
      :label="$t('customers.contractNum.unique')"
      prop="contract_number"
    )
      el-input(
        v-model="frmMod.contract_number"
        :placeholder="$t('contractDocs.noRepeat')"
      )
        template(#append)
          el-button(
            icon="el-icon-document"
            @click="doCopyFromUsername"
            :title="$t('contractDocs.copyFromLogin')")

    el-form-item(:label="$t('contractDocs.dateBegin')" prop="start_service_time")
      el-date-picker(
        v-model="frmMod.start_service_time"
        type="date"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="d.MM.yyyy")

    el-form-item(:label="$t('contractDocs.dateEnd')")
      | {{ frmMod.end_service_time || '—' }}
      //- el-date-picker(
      //-   v-model="frmMod.end_service_time"
      //-   type="datetime"
      //-   value-format="yyyy-MM-dd HH:mm:ss"
      //-   format="d.MM.yyyy HH:mm:ss")

    el-form-item(:label="$t('contractDocs.activity')")
      boolean-icon(v-model="frmMod.is_active")
      |  {{ frmMod.is_active ? $t('contractDocs.activeContract') : $t('contractDocs.inactiveContract') }}

    el-form-item(:label="$t('contractDocs.additional')")
      el-input(
        v-model="frmMod.note"
        type="textarea"
        rows="5"
        cols="40")

    el-form-item
      el-button-group
        el-button(
          type="primary"
          icon="el-icon-upload"
          @click="onSubmit"
          :loading="isLoading"
          :disabled="isFormUntouched"
          :type="isNew ? 'success' : 'default'")
          | {{ isNew ? $t('add') : $t('save') }}

        el-button(
          v-if="!isNew"
          icon="el-icon-document"
          @click="openDocsDialog")
          | {{ $t('customers.docs') }}

        el-button(
          icon="el-icon-finished"
          @click="finishContractDialog"
          :disabled="finishBtnDisabled"
          type='danger'
        ) {{ $t('contractDocs.finishBtn') }}

    el-dialog(
      :title="$t('customers.docs')"
      :visible.sync="docsDialogVisible"
    )
      contract-docs(:contract="contract")
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import FormMixin from '@/utils/forms'
import { ICustomer } from '@/api/customers/types'
import { ICustomerContract } from './api/types'
import { Form } from 'element-ui'
import { addContract, changeContract, finishCustomerContract, getContractInitials } from './api/reqs'
import ContractDocs from './contract-docs.vue'
import BooleanIcon from '@/components/boolean-icon.vue'

@Component({
  name: 'ContractForm',
  components: {
    ContractDocs,
    BooleanIcon
  }
})
export default class extends mixins(FormMixin) {
  @Prop({ default: null })
  private contract!: ICustomerContract | null

  private isLoading = false
  private docsDialogVisible = false
  private currentContractId = 0

  private frmMod: ICustomerContract = {
    id: undefined,
    title: '',
    customer_id: this.$store.state.customer.id,
    start_service_time: '',
    end_service_time: null,
    is_active: true,
    contract_number: this.$store.state.customer.username,
    note: ''
  }

  private fillFrmModFromVar(contract: ICustomerContract) {
    this.frmMod.id = contract.id
    this.frmMod.title = contract.title
    this.frmMod.customer_id = contract.customer_id || this.$store.state.customer.id
    this.frmMod.start_service_time = contract.start_service_time
    this.frmMod.end_service_time = contract.end_service_time || null
    this.frmMod.is_active = contract.is_active
    this.frmMod.contract_number = contract.contract_number
    this.frmMod.note = contract.note
  }

  private frmRules = {
    contract_number: [
      { required: true, message: this.$tc('customers.contractNum.required'), trigger: 'blur' }
    ],
    start_service_time: [
      { required: true, message: this.$tc('customers.contractNum.validation'), trigger: 'blur' }
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

  async created() {
    if (this.contract) {
      this.fillFrmModFromVar(this.contract)
    } else {
      const contr = await getContractInitials()
      this.fillFrmModFromVar(contr.data)
      this.doCopyFromUsername()
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
            this.$message.success(
              this.$tc('contractDocs.addedMsg')
            )
          } else {
            if (this.contract && this.contract.id) {
              const newDat = await changeContract(this.contract.id, this.frmMod)
              this.$emit('changed', newDat)
              this.$message.success(
                this.$tc('contractDocs.savedMsg')
              )
            } else {
              const tx = 'Logic error on contractForm in onSubmit()'
              this.$message.error(tx)
              throw new Error(tx)
            }
          }
        } finally {
          this.isLoading = false
        }
      } else {
        this.$message.error(
          this.$tc('fixFormErrs')
        )
      }
    })
  }

  private doCopyFromUsername() {
    this.frmMod.contract_number = this.$store.state.customer.username
  }

  private openDocsDialog() {
    this.docsDialogVisible = true
  }

  private finishContractDialog() {
    this.$confirm(
      this.$tc('contractDocs.finishAlert'),
      {
        type: 'error',
        title: this.$tc('attention')
      }
    ).then(async() => {
      await this.finishContract()
      this.$message.success(this.$tc('contractDocs.finishSuccessText'))
    })
  }

  private async finishContract() {
    if (this.contract && this.contract.id) {
      const { data } = await finishCustomerContract(this.contract.id)
      this.fillFrmModFromVar(data)
    }
  }

  private get finishBtnDisabled() {
    return this.frmMod.end_service_time !== null
  }
}
</script>
