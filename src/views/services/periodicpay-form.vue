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
      el-button(
        icon='el-icon-upload'
        type="primary"
        @click="onSubmit"
        :loading="isLoading"
      ) Сохранить
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
      { required: true, message: 'Название надо указать', trigger: 'blur' }
    ],
    amount: [
      { required: true, message: 'Цену надо указать', trigger: 'blur' },
      { validator: positiveValidator, trigger: 'change', message: 'Цена должна быть положительной или 0' }
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

  get isNew() {
    return PeriodicPayModule.id === 0
  }
}
</script>
