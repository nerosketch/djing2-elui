<template lang="pug">
  el-form(
    ref="frm"
    v-loading="loading"
    status-icon
    :rules="frmRules"
    :model="frmMod")
    el-form-item(:label="$t('customers.amount')" prop="cost")
      el-input(
        v-model="frmMod.cost"
        type="number"
        max="15000")

    el-form-item(:label="$t('comment')" prop="comment")
      el-input(v-model="frmMod.comment" :maxlength="128")

    el-form-item
      el-button(
        icon="el-icon-upload"
        type="primary"
        @click="onSubmit"
        :loading="loading")
        | {{ $t('save') }}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { CustomerModule } from '@/store/modules/customers/customer'
import { IBalanceAmountRequest } from '@/api/customers/types'

@Component({
  name: 'add-cash'
})
export default class extends Vue {
  private loading = false
  private frmMod: IBalanceAmountRequest = {
    cost: 0,
    comment: ''
  }

  private frmRules = {
    cost: [
      { required: true, message: this.$tc('customers.howMuchAddition'), trigger: 'blur' },
      {
        validator: (rule: any, value: number, callback: Function) => {
          if (value >= 15000) {
            callback(new Error(rule.message))
          } else {
            callback()
          }
        },
        trigger: 'change',
        message: this.$tc('customers.additionMoreThanForbidden') + ' 15000'
      },
      {
        validator: (rule: any, value: number, callback: Function) => {
          if (value <= (-15000)) {
            callback(new Error(rule.message))
          } else {
            callback()
          }
        },
        trigger: 'change',
        message: this.$tc('customers.withdrawalMoreThanForbidden') + ' 15000'
      }
    ]
  }

  private onSubmit() {
    (this.$refs.frm as Form).validate(async valid => {
      if (valid) {
        this.loading = true
        try {
          await CustomerModule.AddBalance(this.frmMod)
          await CustomerModule.UpdateCustomer()
          this.$emit('done', this.frmMod.cost)
        } finally {
          this.loading = false
        }
      } else {
        this.$message.error(
          this.$tc('fixFormErrs')
        )
      }
    })
  }
}
</script>
