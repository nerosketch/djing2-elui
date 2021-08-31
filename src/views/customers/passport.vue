<template lang="pug">
  el-form(
    ref='pspfrm'
    status-icon
    :rules='frmRules'
    :model='frmMod'
    v-loading='loading'
  )
    el-form-item(
      label="Серия пас."
      prop='series'
    )
      el-input(v-model="frmMod.series" type='number')
    el-form-item(
      label="Номер пас."
      prop='number'
    )
      el-input(v-model="frmMod.number" type='number')
    el-form-item(
      label="Кем выдан"
      prop='distributor'
    )
      el-input(v-model="frmMod.distributor" :maxlength='64')
    el-form-item(
      label="Код подразделения"
      prop='division_code'
    )
      el-input(v-model="frmMod.division_code" :maxlength='64')
    el-form-item(
      label="Дата выдачи"
      prop='date_of_acceptance'
    )
      el-date-picker(
        v-model="frmMod.date_of_acceptance"
        type="date"
        value-format="yyyy-MM-d"
        format="d.MM.yyyy"
      )
    el-form-item
      el-button(
        icon='el-icon-upload'
        type='primary' @click="onSubmit" :loading="loading"
        :disabled="!$perms.customers.add_passportinfo || !$perms.customers.change_passportinfo"
      ) Сохранить
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
      { required: true, message: 'Укажи серию паспорта', trigger: 'blur' },
      { max: 4, trigger: 'change', message: 'Серия паспорта не должна быть больше 4х символов' }
    ],
    number: [
      { required: true, message: 'Укажи номер паспорта', trigger: 'blur' },
      { max: 6, trigger: 'change', message: 'Номер паспорта не должен быть больше 6ти символов' }
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
        this.loading = true
        try {
          let { data } = await setPassportInfo(CustomerModule.pk, this.frmMod)
          this.$emit('done', data)
        } catch (err) {
          this.$message.error(err)
        } finally {
          this.loading = false
        }
      } else {
        this.$message.error('Исправь ошибки в форме')
      }
    })
  }

  private async loadPasspInfo() {
    this.loading = true
    try {
      const { data } = await getPassportInfo(CustomerModule.pk)
      this.frmMod = data
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.loading = false
    }
  }

  mounted() {
    this.loadPasspInfo()
  }
}
</script>
