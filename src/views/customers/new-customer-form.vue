<template lang="pug">
  el-form(
    ref='frm'
    status-icon
    :rules="frmRules"
    :model="frmMod"
    v-loading="loading"
  )
    customer-form-fio(
      v-model="frmMod.fio"
    )
    el-form-item(
      label="Логин"
      prop='username'
    )
      el-input(v-model="frmMod.username")
    el-form-item(
      label="Телефон"
      prop='telephone'
    )
      el-input(v-model="frmMod.telephone")
    el-form-item(
      label="Группа"
    )
      groups-choice(v-model="frmMod.group")
    el-form-item(
      label="Комментарий"
    )
      el-input(
        v-model="frmMod.description"
        type="textarea"
        rows="4"
        cols="40"
        autosize
      )
    el-form-item(
      label="Дом"
    )
      el-input(
        v-model="frmMod.house"
        :maxlength='12'
      )
    el-form-item(
      label="День рождения"
      prop='birth_day'
    )
      el-date-picker(
        v-model="frmMod.birth_day"
        type="date"
        value-format="yyyy-MM-dd"
        format="d.MM.yyyy"
      )
    el-form-item
      el-button(
        icon='el-icon-upload'
        type="primary"
        @click="onSubmit"
        :disabled="!$perms.customers.add_customer"
      ) Сохранить
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { CustomerModule } from '@/store/modules/customers/customer'
import { ICustomerFrm, ICustomer } from '@/api/customers/types'
import { latinValidator, telephoneValidator } from '@/utils/validate'
import CustomerFormFio from './customer-form-fio.vue'
import GroupsChoice from '@/views/groups/groups-choice.vue'

@Component({
  name: 'NewCustomerForm',
  components: {
    CustomerFormFio,
    GroupsChoice
  }
})
export default class extends Vue {
  private loading = false

  @Prop({ default: 0 })
  private selectedAddress!: number

  private frmMod: ICustomerFrm = {
    username: '',
    telephone: '',
    fio: '',
    birth_day: null,
    group: 0,
    address: this.selectedAddress,
    house: '',
    is_active: false,
    is_dynamic_ip: false,
    description: ''
  }

  private frmRules = {
    username: [
      { required: true, message: 'Логин абонента обязателен', trigger: 'blur' },
      { validator: latinValidator, trigger: 'change', message: 'Логин может содержать латинские символы и цифры' }
    ],
    telephone: [
      { validator: telephoneValidator, trigger: 'change', message: '+[7,8,9,3] и 10,11 цифр' }
    ],
    birth_day: [
      { required: true, message: 'Нужно указать дату рождения', trigger: 'blur' }
    ]
  }

  @Watch('$store.state.customer', { deep: true })
  private onChangedId() {
    const frm = this.$store.state.customer as ICustomer
    this.frmMod = {
      username: frm.username,
      telephone: frm.telephone,
      fio: frm.fio,
      birth_day: frm.birth_day!,
      group: frm.group || 0,
      address: frm.address || this.selectedAddress || 0,
      house: frm.house,
      is_active: frm.is_active,
      is_dynamic_ip: frm.is_dynamic_ip,
      description: frm.description
    }
  }

  created() {
    CustomerModule.InitDefaults().then(initialForm => {
      this.frmMod.username = initialForm.username
    })
  }

  private onSubmit() {
    (this.$refs.frm as Form).validate(async valid => {
      if (valid) {
        this.loading = true
        try {
          const newDat = await CustomerModule.AddCustomer(this.frmMod)
          this.$emit('done', newDat)
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
}
</script>
