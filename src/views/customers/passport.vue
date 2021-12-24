<template>
  <el-form ref="pspfrm" status-icon :rules="frmRules" :model="frmMod" v-loading="loading">
    <el-form-item :label="$t('customers.passportSerial')" prop="series">
      <el-input v-model="frmMod.series" type="number"></el-input>
    </el-form-item>
    <el-form-item :label="$t('customers.passportNum')" prop="number">
      <el-input v-model="frmMod.number" type="number"></el-input>
    </el-form-item>
    <el-form-item :label="$t('customers.passportDistributor')" prop="distributor">
      <el-input v-model="frmMod.distributor" :maxlength="64"></el-input>
    </el-form-item>
    <el-form-item :label="$t('customers.passportDivisionCode')" prop="division_code">
      <el-input v-model="frmMod.division_code" :maxlength="64"></el-input>
    </el-form-item>
    <el-form-item :label="$t('customers.passportDivisionCode')" prop="date_of_acceptance">
      <el-date-picker v-model="frmMod.date_of_acceptance" type="date" value-format="yyyy-MM-d" format="d.MM.yyyy"></el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button icon="el-icon-upload" type="primary" @click="onSubmit" :loading="loading" :disabled="!$perms.customers.add_passportinfo || !$perms.customers.change_passportinfo">{{ $t('save') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { IPassportInfo } from '@/api/customers/types'
import { setPassportInfo, getPassportInfo } from '@/api/customers/req'
import { CustomerModule } from '@/store/modules/customers/customer'

@Component({
  name: 'Passport'
})
export default class extends Vue {
  private loading = false

  private frmMod: IPassportInfo = {
    id: 0,
    series: '',
    number: '',
    distributor: '',
    date_of_acceptance: '',
    division_code: ''
  }

  private frmRules = {
    series: [
      {
        required: true,
        message: this.$t('customers.passportSerialRequiredMsg'),
        trigger: 'blur'
      },
      {
        max: 4,
        trigger: 'change',
        message: this.$t('customers.passportSerialValidationMsg'),
      }
    ],
    number: [
      {
        required: true,
        message: this.$t('customers.passportNumRequiredMsg'),
        trigger: 'blur'
      },
      {
        max: 6,
        trigger: 'change',
        message: this.$t('customers.passportNumValidatationMsg')
      }
    ],
    distributor: [
      {
        required: true,
        message: this.$t('customers.passportDistributorRequiredMsg'),
        trigger: 'blur'
      }
    ],
    date_of_acceptance: [
      {
        required: true,
        message: this.$t('customers.passportDateOfAcceptanceRequiredMsg'),
        trigger: 'blur'
      }
    ]
  }

  private onSubmit() {
    (this.$refs.pspfrm as Form).validate(async valid => {
      if (valid) {
        this.loading = true
        try {
          const { data } = await setPassportInfo(CustomerModule.id, this.frmMod)
          this.$emit('done', data)
        } finally {
          this.loading = false
        }
      } else {
        this.$message.error(this.$t('fixFormErrs').toString())
      }
    })
  }

  private async loadPasspInfo() {
    this.loading = true
    try {
      const { data } = await getPassportInfo(CustomerModule.id)
      this.frmMod = data
    } finally {
      this.loading = false
    }
  }

  mounted() {
    this.loadPasspInfo()
  }
}
</script>
