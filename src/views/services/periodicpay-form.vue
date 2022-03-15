<template lang="pug">
  el-form(
    ref="perfrm"
    status-icon
    :rules="frmRules"
    :model="frmMod"
    v-loading="isLoading")
    el-form-item(:label="$t('title')" prop="name")
      el-input(v-model="frmMod.name")

    el-form-item(:label="$t('value')" prop="amount")
      el-input(v-model="frmMod.amount")

    el-form-item
      el-button(
        icon="el-icon-upload"
        type="primary"
        @click="onSubmit"
        :loading="isLoading")
        | {{ $t('save') }}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { positiveValidator } from '@/utils/validate'
import { PeriodicPayModule } from '@/store/modules/services/periodic-pay'

@Component({
  name: 'periodicpay-form'
})
export default class extends Vue {
  private isLoading = false

  private frmRules = {
    name: [
      { required: true, message: this.$tc('nameShouldBeIndicated'), trigger: 'blur' }
    ],
    amount: [
      { required: true, message: this.$tc('thePriceShouldBeSpecified'), trigger: 'blur' },
      { validator: positiveValidator, trigger: 'change', message: this.$tc('thePriceShallBePositiveOr0') }
    ]
  }

  private frmMod = {
    name: PeriodicPayModule.name,
    amount: PeriodicPayModule.amount
  }

  private onSubmit() {
    (this.$refs.perfrm as Form).validate(async valid => {
      if (valid) {
        try {
          this.isLoading = true
          let newDat
          if (this.isNew) {
            newDat = await PeriodicPayModule.AddPeriodicPay(this.frmMod)
          } else {
            newDat = await PeriodicPayModule.PatchPeriodicPay(this.frmMod)
          }
          this.$emit('done', newDat)
        } finally {
          this.isLoading = false
        }
      } else {
        this.$message.error(this.$tc('fixFormErrs'))
      }
    })
  }

  get isNew() {
    return PeriodicPayModule.id === 0
  }
}
</script>
