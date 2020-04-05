<template lang="pug">
  el-form(
    ref='perfrm'
    status-icon
    :rules='frmRules'
    :model='frmMod'
    v-loading='isLoading'
  )
    el-form-item(
      label="Название"
      prop='name'
    )
      el-input(v-model="frmMod.name")
    el-form-item(
      label="Стоимость"
      prop="amount"
    )
      el-input(v-model="frmMod.amount")
    el-form-item
      el-button(type="primary" @click="onSubmit" :loading="isLoading") Сохранить
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { positiveValidator } from '@/utils/validate'
import { IPeriodicPay } from '@/api/services/types'
import { PeriodicPayModule } from '@/store/modules/services/periodic-pay'

@Component({
  name: 'periodicpay-form'
})
export default class extends Vue {
  private isLoading = false

  private frmRules = {
    name: [
      { required: true, message: 'Название надо указать', trigger: 'blur' }
    ],
    amount: [
      { required: true, message: 'Цену надо указать', trigger: 'blur' },
      { validator: positiveValidator, trigger: 'change', message: 'Цена должна быть положительной или 0' }
    ]
  }

  private frmMod: IPeriodicPay = <IPeriodicPay>PeriodicPayModule.context.state

  private onSubmit() {
    (this.$refs['perfrm'] as Form).validate(async valid => {
      console.log('this.frmMod', this.frmMod)
      if (valid) {
        this.isLoading = true
        console.log('this.frmMod', this.frmMod)
        await PeriodicPayModule.SET_ALL(this.frmMod)
        const newDat = await PeriodicPayModule.SavePeriodicPay()
        this.isLoading = false
        this.$emit('done', newDat)
      } else {
        this.$message.error('Исправьте ошибки в форме')
      }
    })
  }
}
</script>
