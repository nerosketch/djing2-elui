<template lang="pug">
  el-form(
    ref='customerfrm'
    label-width="100px"
    size="mini"
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
        template(v-slot:append)
          el-button
            a(:href="`tel:${frmMod.telephone}`") call
          el-button(@click="openTelsDlg=true") tels
          el-button Add
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
      label="Опции"
    )
      el-checkbox(v-model="frmMod.is_active") - Активный: {{ frmMod.is_active ? 'Да' : 'Нет' }}
      el-checkbox(v-model="frmMod.is_dynamic_ip") - Динамические настройки по dhcp: {{ frmMod.is_dynamic_ip ? 'Да' : 'Нет' }}
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
      el-button-group
        el-button(type="primary" icon='el-icon-download' @click="onSubmit" :loading="isLoading") Сохранить
        el-button(type="success" icon='el-icon-plus' @click="openTaskFormDialog" :loading="taskFormDialogLoading") Добавить задачу
        el-button(@click="openPasportDlg = true" icon='el-icon-paperclip') Паспорт
        el-button(
          type='danger'
          title="Полное удаление учётной записи абонента из билинга"
          icon='el-icon-close'
          @click="delCustomer"
        ) Удалить уч.
    el-dialog(
      title="Паспортные данные"
      :visible.sync="openPasportDlg"
    )
      passport
    el-dialog(
      title="Дополнительные телефоны"
      :visible.sync="openTelsDlg"
    )
      additional-tels
    el-dialog(
      title='Создание задачи'
      :visible.sync='taskFormDialog'
    )
      task-form
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { latinValidator, telephoneValidator } from '@/utils/validate'
import { ICustomerStreet, ICustomerGroup, ICustomerFrm } from '@/api/customers/types'
import { getStreets, getCustomerGroups } from '@/api/customers/req'
import { CustomerStreetModule } from '@/store/modules/customers/street'
import { TaskModule } from '@/store/modules/tasks/tasks'
import TaskForm from '@/views/tasks/task-form.vue'
import { CustomerModule } from '@/store/modules/customers/customer'
import Passport from './passport.vue'
import AdditionalTels from './customers-details/additional-tels.vue'

@Component({
  name: 'customer-form',
  components: { Passport, AdditionalTels, TaskForm }
})
export default class extends Vue {
  private isLoading = false
  private customerStreets: ICustomerStreet[] = []
  private groups: ICustomerGroup[] = []
  private openPasportDlg = false
  private openTelsDlg = false
  private taskFormDialog = false
  private taskFormDialogLoading = false

  private frmRules = {
    username: [
      { required: true, message: 'Логин абонента обязателен', trigger: 'blur' },
      { validator: latinValidator, trigger: 'change', message: 'Логин может содержать латинские символы и цифры' }
    ],
    telephone: [
      { validator: telephoneValidator, trigger: 'change', message: '+[7,8,9,3] и 10,11 цифр' }
    ]
  }

  private frmMod: ICustomerFrm = {
    username: '',
    telephone: '',
    fio: '',
    group: 0,
    street: null,
    house: '',
    is_active: false,
    is_dynamic_ip: false,
    description: ''
  }

  created() {
    this.loadGroups()
    this.loadStreets()
    this.onChangedId()
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
      street: CustomerModule.street === 0 ? null : CustomerModule.street,
      house: CustomerModule.house,
      is_active: CustomerModule.is_active,
      is_dynamic_ip: CustomerModule.is_dynamic_ip,
      description: CustomerModule.description
    }
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
    (this.$refs['customerfrm'] as Form).validate(async valid => {
      if (valid) {
        this.isLoading = true
        const newDat = await CustomerModule.PatchCustomer(this.frmMod)
        this.isLoading = false
        this.$emit('done', newDat)
        this.$message.success('Абонент сохранён')
      } else {
        this.$message.error('Исправь ошибки в форме')
      }
    })
  }

  private delCustomer() {
    this.$confirm('Точно удалить учётку абонента? Вместе с ней удалится вся история следов пребывания учётки в билинге.', 'Внимание').then(async() => {
      const currGroup = CustomerModule.group
      await CustomerModule.DelCustomer()
      this.$message.success('Учётка удалена')
      this.$router.push({ name: 'customersList', params: { groupId: currGroup.toString() } })
    })
  }

  private async openTaskFormDialog() {
    this.taskFormDialogLoading = true
    await TaskModule.GetInitial4NewTask(CustomerModule.group)
    TaskModule.SET_CUSTOMER(CustomerModule.pk)
    TaskModule.SET_CUSTOMER_FULLNAME(CustomerModule.full_name)
    this.taskFormDialogLoading = false
    this.taskFormDialog = true
  }
}
</script>
