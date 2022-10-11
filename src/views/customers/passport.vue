<template lang="pug">
  el-form(
    ref="pspfrm"
    status-icon
    :rules="frmRules"
    :model="frmMod"
    v-loading="loading")
    el-form-item(:label="$t('customers.passportSerial')" prop="series")
      el-input(v-model="frmMod.series" type="number")

    el-form-item(:label="$t('customers.passportNum')" prop="number")
      el-input(v-model="frmMod.number" type="number")

    el-form-item(:label="$t('customers.passportDistributor')" prop="distributor")
      el-input(v-model="frmMod.distributor" :maxlength="64")

    el-form-item(:label="$t('customers.passportDivisionCode')" prop="division_code")
      el-input(v-model="frmMod.division_code" :maxlength="64")

    el-form-item(:label="$t('customers.passportDateOfAcceptance')" prop="date_of_acceptance")
      el-date-picker(
        v-model="frmMod.date_of_acceptance"
        type="date"
        value-format="yyyy-MM-d"
        format="d.MM.yyyy"
      )
    el-form-item(
      label="Адрес регистрации"
    )
      addr-field-input(v-model="frmMod.registration_address")
        template(#buttons)
          el-tooltip(effect="dark" content="Совпадает с адресом учётной записи")
            el-button(@click="copyFromCustomerAddr" icon='el-icon-document-copy')
    el-form-item
      el-button(
        icon="el-icon-upload"
        type="primary"
        @click="onSubmit"
        :loading="loading"
        :disabled="!$perms.customers.add_passportinfo || !$perms.customers.change_passportinfo")
        | {{ $t('save') }}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { IPassportInfo } from '@/api/customers/types'
import { setPassportInfo, getPassportInfo } from '@/api/customers/req'
import { CustomerModule } from '@/store/modules/customers/customer'
import AddrFieldInput from '@/components/Address/addr-field-input/index.vue'

@Component({
  name: 'Passport',
  components: {
    AddrFieldInput
  }
})
export default class extends Vue {
  private loading = false

  private frmMod: IPassportInfo = {
    id: 0,
    series: '',
    number: '',
    distributor: '',
    date_of_acceptance: '',
    division_code: '',
    registration_address_id: 0,
    registration_address_title: ''
  }

  private frmRules = {
    series: [
      {
        required: true,
        message: this.$tc('customers.passportSerialRequiredMsg'),
        trigger: 'blur'
      },
      {
        max: 4,
        trigger: 'change',
        message: this.$tc('customers.passportSerialValidationMsg')
      }
    ],
    number: [
      {
        required: true,
        message: this.$tc('customers.passportNumRequiredMsg'),
        trigger: 'blur'
      },
      {
        max: 6,
        trigger: 'change',
        message: this.$tc('customers.passportNumValidatationMsg')
      }
    ],
    distributor: [
      {
        required: true,
        message: this.$tc('customers.passportDistributorRequiredMsg'),
        trigger: 'blur'
      }
    ],
    date_of_acceptance: [
      {
        required: true,
        message: this.$tc('customers.passportDateOfAcceptanceRequiredMsg'),
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
        this.$message.error(this.$tc('fixFormErrs'))
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

  private copyFromCustomerAddr() {
    this.frmMod.registration_address_id = CustomerModule.address_id
  }
}
</script>
