<template lang="pug">
  el-form(
    ref='frm'
    v-loading='loading'
    size="mini"
    status-icon
    :rules='frmRules'
    :model='frmMod'
  )
    el-form-item(
      label="Количество денег"
      prop='cost'
    )
      el-input(v-model="frmMod.cost" type='number' max="5000")
    el-form-item(
      label="Комментарий"
      prop='comment'
    )
      el-input(v-model="frmMod.comment" :maxlength='128')
    el-form-item
      el-button(type="primary" @click="onSubmit" :loading="loading") Сохранить
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
      { required: true, message: 'Укажи сколько денег надо положить на счёт', trigger: 'blur' },
      { validator: (rule: any, value: number, callback: Function) => {
        if (value >= 5000) {
          callback(new Error(rule.message))
        } else {
          callback()
        }
      },
      trigger: 'change',
      message: 'Нельзя пополнять больше чем на 5000' },
      { validator: (rule: any, value: number, callback: Function) => {
        if (value <= (-5000)) {
          callback(new Error(rule.message))
        } else {
          callback()
        }
      },
      trigger: 'change',
      message: 'Нельзя снимать больше чем 5000' }
    ]
  }

  private onSubmit() {
    (this.$refs['frm'] as Form).validate(async valid => {
      if (valid) {
        this.loading = true
        await CustomerModule.AddBalance(this.frmMod)
        await CustomerModule.UpdateCustomer()
        this.loading = false
        this.$emit('done', this.frmMod.cost)
      } else {
        this.$message.error('Исправь ошибки в форме')
      }
    })
  }
}
</script>
