<template lang="pug">
  el-form(
    ref='pspfrm'
    size="mini"
    status-icon
    :rules='frmRules'
    :model='frmMod'
    v-loading='loading'
  )
    el-form-item(
      label="Серия пас."
      prop='series'
    )
      el-input(v-model="frmMod.series" type='number' maxlength='4')
    el-form-item(
      label="Номер пас."
      prop='number'
    )
      el-input(v-model="frmMod.number" type='number' maxlength='6')
    el-form-item(
      label="Кем выдан"
      prop='distributor'
    )
      el-input(v-model="frmMod.distributor" :maxlength='64')
    el-form-item(
      label="Дата выдачи"
      prop='date_of_acceptance'
    )
      el-date-picker(v-model="frmMod.date_of_acceptance" type="date")
    el-form-item
    el-button(type="primary" @click="onSubmit" :loading="loading") Сохранить
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { IPassportInfo } from '@/api/customers/types'
// import { CustomerModule } from '@/store/modules/customers/customer'

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
    date_of_acceptance: ''
  }

  private frmRules = {
    series: [
      { required: true, message: 'Укажи серию паспорта', trigger: 'blur' }
    ],
    number: [
      { required: true, message: 'Укажи номер паспорта', trigger: 'blur' }
    ],
    distributor: [
      { required: true, message: 'Укажи кем выдан паспорт', trigger: 'blur' }
    ],
    date_of_acceptance: [
      { required: true, message: 'Надо указать когда он был выдан', trigger: 'blur' }
    ]
  }

  private onSubmit() {
    (this.$refs['pspfrm'] as Form).validate(async valid => {
      if (valid) {
        console.log('Save passport:', this.frmMod)
        // this.loading = true
        // await CustomerModule.SET_ALL(this.frmMod)
        // const newDat = await CustomerModule.SaveCustomer()
        // this.loading = false
        // this.$emit('done', newDat)
      } else {
        this.$message.error('Исправь ошибки в форме')
      }
    })
  }
}
</script>
