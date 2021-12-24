<template>
  <el-form ref="frm" status-icon :rules="frmRules" :model="frmMod" v-loading="loading">
    <customer-form-fio v-model="frmMod.fio"></customer-form-fio>
    <el-form-item :label="$t('customers.login')" prop="username">
      <el-input v-model="frmMod.username"></el-input>
    </el-form-item>
    <el-form-item :label="$t('customers.phone')" prop="telephone">
      <el-input v-model="frmMod.telephone"></el-input>
    </el-form-item>
    <el-form-item :label="$t('groups.group')">
      <groups-choice v-model="frmMod.group"></groups-choice>
    </el-form-item>
    <el-form-item :label="$t('comment')">
      <el-input v-model="frmMod.description" type="textarea" rows="4" cols="40" autosize></el-input>
    </el-form-item>
    <el-form-item :label="$t('customers.birthDay')" prop="birth_day">
      <el-date-picker v-model="frmMod.birth_day" type="date" value-format="yyyy-MM-dd" format="d.MM.yyyy"></el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button icon="el-icon-upload" type="primary" @click="onSubmit" :disabled="!$perms.customers.add_customer">{{ $t('save') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { CustomerModule } from '@/store/modules/customers/customer'
import { ICustomerFrm, ICustomer } from '@/api/customers/types'
import { latinValidator, telephoneValidator } from '@/utils/validate'
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
    group: 0,
    address: this.selectedAddress,
    house: '',
    is_active: false,
    is_dynamic_ip: false,
    gateway: 0,
    description: ''
  }

  private frmRules = {
    username: [
      {
        required: true,
        message: this.$t('customers.loginFieldRequiredMsg'),
        trigger: 'blur'
      },
      {
        validator: latinValidator,
        trigger: 'change',
        message: this.$t('customers.loginValidationMessage')
      }
    ],
    telephone: [
      {
        validator: telephoneValidator,
        trigger: 'change',
        message: this.$t('7-8-9-3-i-10-11-cifr-0')
      }
    ],
    birth_day: [
      {
        required: true,
        message: this.$t('customers.birthDayValidationMessage'),
        trigger: 'blur'
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
      group: frm.group || 0,
      address: frm.address || this.selectedAddress || 0,
      house: frm.house,
      is_active: frm.is_active,
      is_dynamic_ip: frm.is_dynamic_ip,
      gateway: frm.gateway,
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
        } catch (err) {
          this.$message.error(err)
        } finally {
          this.loading = false
        }
      } else {
        this.$message.error(this.$t('fixFormErrs').toString())
      }
    })
  }
}
</script>
