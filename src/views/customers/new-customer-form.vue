<template lang="pug">
  el-form(
    ref='frm'
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
      label="Шлюз доступа"
      prop='gateway'
    )
      gws-selectfield(v-model="frmMod.gateway")
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
    el-form-item(
      label="День рождения"
      prop='birth_day'
    )
      el-date-picker(
        v-model="frmMod.birth_day"
        type="date"
        value-format="yyyy-MM-dd"
        format="d MMM yyyy"
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
import { ICustomerGroup, ICustomerStreet, ICustomerFrm } from '@/api/customers/types'
import { latinValidator, telephoneValidator } from '@/utils/validate'
import { getCustomerGroups } from '@/api/customers/req'
import GwsSelectfield from '@/views/gateways/gws-selectfield.vue'

@Component({
  name: 'NewCustomerForm',
  components: {
    GwsSelectfield
  }
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
    birth_day: null,
    group: this.selectedGroup,
    street: null,
    house: '',
    is_active: false,
    is_dynamic_ip: false,
    gateway: 0,
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

  @Watch('$store.state.customer.pk')
  private onChangedId() {
    this.frmMod = {
      username: CustomerModule.username,
      telephone: CustomerModule.telephone,
      fio: CustomerModule.fio,
      birth_day: CustomerModule.birth_day,
      group: CustomerModule.group || this.selectedGroup,
      street: CustomerModule.street,
      house: CustomerModule.house,
      is_active: CustomerModule.is_active,
      is_dynamic_ip: CustomerModule.is_dynamic_ip,
      gateway: CustomerModule.gateway,
      description: CustomerModule.description
    }
  }

  async created() {
    this.loadGroups()
    CustomerModule.InitDefaults().then(initialForm => {
      this.frmMod.username = initialForm.username
    })
  }

  private async loadGroups() {
    this.loading = true
    try {
      const { data } = await getCustomerGroups() as any
      this.groups = data
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.loading = false
    }
  }

  private onSubmit() {
    (this.$refs['frm'] as Form).validate(async valid => {
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
