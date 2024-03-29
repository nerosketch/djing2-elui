<template lang="pug">
  el-form(
    ref="frm"
    status-icon
    :rules="frmRules"
    :model="frmMod"
    v-loading="loading")
    customer-form-fio(v-model="frmMod.fio")

    el-form-item(:label="$t('customers.login')" prop="username")
      el-input(v-model="frmMod.username")

    el-form-item(:label="$t('customers.phone')" prop="telephone")
      el-input(v-model="frmMod.telephone")

    el-form-item(
      prop="group_id"
      :label="$t('groups.group')"
    )
      groups-choice(v-model="frmMod.group_id")

    el-form-item(:label="$t('comment')")
      el-input(
        v-model="frmMod.description"
        type="textarea"
        rows="4"
        cols="40"
        autosize)

    el-form-item(:label="$t('customers.birthDay')" prop="birth_day")
      el-date-picker(
        v-model="frmMod.birth_day"
        type="date"
        value-format="yyyy-MM-dd"
        format="d.MM.yyyy")

    el-form-item
      el-button(
        icon="el-icon-upload"
        type="primary"
        @click="onSubmit"
        :disabled="!$perms.customers.add_customer")
        | {{ $t('save') }}
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { CustomerModule } from '@/store/modules/customers/customer'
import { ICustomerFrm, ICustomer } from '@/api/customers/types'
import { latinValidator, positiveNumberValueAvailable, telephoneValidator } from '@/utils/validate'
import CustomerFormFio from './customer-form-fio.vue'
import GroupsChoice from '@/components/Groups/groups-choice.vue'

@Component({
  name: 'NewCustomerForm',
  components: {
    CustomerFormFio,
    GroupsChoice
  }
})
export default class extends Vue {
  private loading = false

  @Prop({ default: 0 })
  private selectedAddress!: number

  private frmMod: ICustomerFrm = {
    username: '',
    telephone: '',
    fio: '',
    birth_day: null,
    group_id: 0,
    address_id: this.selectedAddress,
    is_active: false,
    is_dynamic_ip: false,
    gateway_id: 0,
    description: ''
  }

  private frmRules = {
    username: [
      {
        required: true,
        message: this.$tc('customers.loginFieldRequiredMsg'),
        trigger: 'blur'
      },
      {
        validator: latinValidator,
        trigger: 'change',
        message: this.$tc('customers.loginValidationMessage')
      }
    ],
    telephone: [
      {
        validator: telephoneValidator,
        trigger: 'change',
        message: this.$tc('telValidation')
      }
    ],
    birth_day: [
      {
        required: true,
        message: this.$tc('customers.birthDayValidationMessage'),
        trigger: 'blur'
      }
    ],
    group_id: [
      {
        validator: positiveNumberValueAvailable,
        trigger: 'change'
      }
    ]
  }

  @Watch('$store.state.customer', { deep: true })
  private onChangedId() {
    const frm = this.$store.state.customer as ICustomer
    this.frmMod = {
      username: frm.username,
      telephone: frm.telephone,
      fio: frm.fio,
      birth_day: frm.birth_day!,
      group_id: frm.group_id || 0,
      address_id: frm.address_id || this.selectedAddress || 0,
      is_active: frm.is_active,
      is_dynamic_ip: frm.is_dynamic_ip,
      gateway_id: frm.gateway_id,
      description: frm.description
    }
  }

  created() {
    CustomerModule.InitDefaults().then(initialForm => {
      this.frmMod.username = initialForm.username
    })
  }

  private onSubmit() {
    (this.$refs.frm as Form).validate(async valid => {
      if (valid) {
        this.loading = true
        try {
          const newDat = await CustomerModule.AddCustomer(this.frmMod)
          this.$emit('done', newDat)
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
