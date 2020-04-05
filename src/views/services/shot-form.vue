<template lang="pug">
  el-form(
    ref='shotfrm'
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
      prop="cost"
    )
      el-input(v-model="frmMod.cost")
    el-form-item
      el-button(type="primary" @click="onSubmit" :loading="isLoading") Сохранить
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { positiveValidator } from '@/utils/validate'
import { IOneShotPay } from '@/api/services/types'
import { OneShotPayModule } from '@/store/modules/services/one-shot-pay'

@Component({
  name: 'shot-form'
})
export default class extends Vue {
  private isLoading = false

  private frmRules = {
    name: [
      { required: true, message: 'Название надо указать', trigger: 'blur' }
    ],
    cost: [
      { required: true, message: 'Цену надо указать', trigger: 'blur' },
      { validator: positiveValidator, trigger: 'change', message: 'Цена должна быть положительной или 0' }
    ]
  }

  private frmMod: IOneShotPay = {
    pk: OneShotPayModule.pk,
    name: OneShotPayModule.name,
    cost: OneShotPayModule.cost
  }

  private onSubmit() {
    (this.$refs['shotfrm'] as Form).validate(async valid => {
      if (valid) {
        this.isLoading = true
        await OneShotPayModule.SET_ALL(this.frmMod)
        const newDat = await OneShotPayModule.SaveOneShotPay()
        this.isLoading = false
        this.$emit('done', newDat)
      } else {
        this.$message.error('Исправьте ошибки в форме')
      }
    })
  }
}
</script>
