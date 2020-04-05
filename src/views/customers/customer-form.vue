<template lang="pug">
  el-form(
    rel='form'
    status-icon
    :rules='frmRules'
    :model='frmMod'
    v-loading='isLoading'
  )
    el-form-item(
      label="Логин"
      prop='username'
    )
      el-input(v-model="frmMod.username")
    el-form-item(
      label="ФИО"
      prop='fio'
    )
      el-input(v-model="frmMod.fio")
    el-form-item(
      label="Телефон"
      prop='telephone'
    )
      el-input(v-model="frmMod.telephone")
    el-form-item(
      label="Улица"
      prop='street'
    )
      el-select(v-model="frmMod.street")
        el-option(
          v-for="cs in customerStreets"
          :key="cs.pk"
          :label="cs.name"
          :value="cs.pk"
        )
    el-form-item(
      label="Дом"
      prop='house'
    )
      el-input(v-model="frmMod.house" :maxlength='12')
    el-form-item(
      label="Активный"
      prop='is_active'
    )
      el-checkbox(v-model="frmMod.is_active") - {{ frmMod.is_active ? 'Да' : 'Нет' }}
    el-form-item(
      label="Авто продление услуги"
      prop='auto_renewal_service'
    )
      el-checkbox(v-model="frmMod.auto_renewal_service") - {{ frmMod.auto_renewal_service ? 'Да' : 'Нет' }}
    el-form-item(
      label="Динамические настройки по dhcp"
      prop='is_dynamic_ip'
    )
      el-checkbox(v-model="frmMod.is_dynamic_ip") - {{ frmMod.is_dynamic_ip ? 'Да' : 'Нет' }}
    el-form-item(
      label="Группа"
      prop='group'
    )
      el-select(v-model="frmMod.group")
        el-option(
          v-for="grp in groups"
          :key="grp.pk"
          :label="grp.title"
          :value="grp.pk"
        )
    el-form-item(
      label="Комментарий"
      prop='description'
    )
      el-input(v-model="frmMod.description" type="textarea" rows="4" cols="40")
    el-form-item
      el-button(type="primary" @click="onSubmit" :loading="isLoading") Сохранить
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { latinValidator,telephoneValidator } from '@/utils/validate'
import { ICustomer, ICustomerStreet, ICustomerGroup } from '@/api/customers/types'
import { getStreets, getCustomerGroups } from '@/api/customers/req'
import { CustomerStreetModule } from '@/store/modules/customers/street'
import { CustomerModule } from '@/store/modules/customers/customer'

@Component({
  name: 'customer-form'
})
export default class extends Vue {
  private isLoading = false
  private customerStreets: ICustomerStreet[] = []
  private groups: ICustomerGroup[] = []

  private frmRules = {
    username: [
      { required: true, message: 'Логин абонента обязателен', trigger: 'blur' },
      { validator: latinValidator, trigger: 'change', message: 'Логин может содержать латинские символы и цифры' }
    ],
    telephone: [
      { validator: telephoneValidator, trigger: 'change', message: '+[7,8,9,3] и 10,11 цифр' }
    ]
  }

  private frmMod: ICustomer = <ICustomer>{
    pk: CustomerModule.pk,
    username: CustomerModule.username,
    fio: CustomerModule.fio,
    telephone: CustomerModule.telephone,
    group: CustomerModule.group,
    description: CustomerModule.description,
    street: CustomerModule.street,
    house: CustomerModule.house,
    gateway: CustomerModule.gateway,
    auto_renewal_service: CustomerModule.auto_renewal_service,
    is_dynamic_ip: CustomerModule.is_dynamic_ip
  }

  created() {
    console.log('Load CustomerForm')
    this.loadGroups()
    this.loadStreets()
    console.log('End LoadCustomerForm')
  }

  private async loadStreets() {
    this.isLoading = true
    const { data } = await getStreets({
      page: 1,
      page_size: 100,
      group: CustomerModule.group
    })
    this.customerStreets = data.results
    this.isLoading = false
  }

  private async loadGroups() {
    this.isLoading = true
    const { data } = await getCustomerGroups()
    this.groups = data.results
    this.isLoading = false
  }

  private onSubmit() {
    (this.$refs['form'] as Form).validate(async valid => {
      if (valid) {
        this.isLoading = true
        await CustomerModule.SET_ALL(this.frmMod)
        const newDat = await CustomerModule.SaveCustomer()
        this.isLoading = false
        this.$emit('done', newDat)
      } else {
        this.$message.error('Исправьте ошибки в форме')
      }
    })
  }
}
</script>
