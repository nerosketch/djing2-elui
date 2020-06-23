<template lang="pug">
  el-form(
    ref='frm'
    label-width="100px"
    size="mini"
    status-icon
    :rules="frmRules"
    :model="frmMod"
    v-loading="loading"
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
    el-form-item
      el-button(type="primary" @click="onSubmit") Сохранить
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { CustomerModule } from '@/store/modules/customers/customer'
import { ICustomer, ICustomerGroup, ICustomerStreet, ICustomerFrm } from '@/api/customers/types'
import { latinValidator, telephoneValidator } from '@/utils/validate'
import { getStreets, getCustomerGroups } from '@/api/customers/req'

@Component({
  name: 'NewCustomerForm'
})
export default class extends Vue {
  private loading = false
  private groups: ICustomerGroup[] = []

  @Prop({ default: () => ([]) })
  private customerStreets!: ICustomerStreet[]

  @Prop({ default: 0 })
  private selectedGroup!: number

  private frmMod: ICustomerFrm = {
    username: '',
    telephone: '',
    fio: '',
    group: this.selectedGroup,
    street: null,
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
    fio: [
      { required: true, message: 'ФИО абонента надо бы указать', trigger: 'blur' }
    ],
    telephone: [
      { validator: telephoneValidator, trigger: 'change', message: '+[7,8,9,3] и 10,11 цифр' }
    ]
  }

  get onChId() {
    return CustomerModule.pk
  }
  @Watch('onChId')
  private onChangedId() {
    this.frmMod = {
      username: CustomerModule.username,
      telephone: CustomerModule.telephone,
      fio: CustomerModule.fio,
      group: CustomerModule.group,
      street: CustomerModule.street,
      house: CustomerModule.house,
      is_active: CustomerModule.is_active,
      is_dynamic_ip: CustomerModule.is_dynamic_ip,
      description: CustomerModule.description
    }
  }

  async created() {
    await this.loadGroups()
  }

  private async loadGroups() {
    this.loading = true
    const { data } = await getCustomerGroups()
    this.groups = data.results
    this.loading = false
  }

  private onSubmit() {
    (this.$refs['frm'] as Form).validate(async valid => {
      if (valid) {
        this.loading = true
        const newDat = await CustomerModule.AddCustomer(this.frmMod)
        this.loading = false
        this.$emit('done', newDat)
      } else {
        this.$message.error('Исправь ошибки в форме')
      }
    })
  }
}
</script>
