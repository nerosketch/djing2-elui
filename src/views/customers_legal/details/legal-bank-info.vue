<template lang="pug">
  el-form(
    status-icon
    :rules="frmRules"
    :model="frmMod"
    v-loading="loading"
  )
    el-form-item(
      label="Название банка"
      prop="title"
    )
      el-input(
        v-model="frmMod.title"
      )
    el-form-item(
      label="Почтовый индекс почтового адреса абонента"
      prop="post_index"
    )
      el-input(
        v-form="frmMod.post_index"
      )
    el-form-item(
      label="Номер банковского счёта"
      prop="number"
    )
      el-input(
        v-form="frmMod.number"
      )
    el-form-item(
      label="БИК"
    )
      el-input(
        v-model="frmMod.bank_code"
      )
    el-form-item(
      label="Корреспондентский счёт"
    )
      el-input(
        v-model="frmMod.correspondent_account"
      )
    el-form-item(
      label="Расчётный счёт"
    )
      el-input(
        v-model="frmMod.settlement_account"
      )
    el-form-item
      el-button(
        icon="el-icon-upload"
        @click="onSubmit"
      ) Сохранить
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'LegalBankInfo'
})
export default class extends Vue {
  private loading = false

  private frmMod = {
    title: '',
    post_index: '',
    number: '',
    bank_code: '',
    correspondent_account: '',
    settlement_account: ''
  }

  private frmRules = {
    title: [
      { required: true, message: 'Название банка обязательно', trigger: 'blur' },
    ],
    post_index: [
      { required: true, message: 'Обязательно', trigger: 'blur' },
    ],
    number: [
      { required: true, message: 'Обязательно', trigger: 'blur' },
    ]
  }

  private onSubmit() {
  }
}
</script>
