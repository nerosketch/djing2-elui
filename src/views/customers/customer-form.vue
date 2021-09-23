<template lang="pug">
  el-form(
    ref='customerfrm'
    :label-width="$store.getters.isMobileView ? undefined : '125px'"
    status-icon
    :rules='frmRules'
    :model='frmMod'
    v-loading='isLoading'
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
      tels-input(v-model="frmMod.telephone")
    el-form-item(
      label="Дом"
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
        format="d.MM.yyyy"
      )
    el-form-item(
      label="Опции"
    )
      el-checkbox(v-model="frmMod.is_active") - Активный: {{ frmMod.is_active ? 'Да' : 'Нет' }}
      el-checkbox(v-model="frmMod.is_dynamic_ip") - Динамические настройки по dhcp: {{ frmMod.is_dynamic_ip ? 'Да' : 'Нет' }}
    el-form-item(
      label="Группа"
    )
      groups-choice(v-model="frmMod.group")
    el-form-item(
      label="Адрес"
    )
      address-choice(v-model="frmMod.locality")
    //- el-form-item(
    //-   label="Шлюз доступа"
    //- )
    //-   gws-selectfield(v-model="frmMod.gateway")
    el-form-item(
      label="Памятка"
    )
      el-input(v-model="frmMod.description" type="textarea" rows="4" cols="40" autosize)
    el-form-item
      el-button-group
        el-button(
          type="primary" icon='el-icon-upload'
          @click="onSubmit"
          :loading="isLoading"
          :disabled="isFormUntouched"
        ) Сохранить
        el-button(
          type="success" icon='el-icon-plus'
          @click="openTaskFormDialog"
          :loading="taskFormDialogLoading"
        ) Добавить задачу
        el-button(
          @click="openPasportDlg = true" icon='el-icon-paperclip'
          :disabled="!$perms.customers.view_passportinfo"
        ) Паспорт
        el-button(
          @click="openPasswordDlg = true"
          icon='el-icon-lock'
        ) Пароль
        el-button(
          v-if="$perms.is_superuser"
          @click="sitesDlg = true"
          icon='el-icon-lock'
        ) Сайты
        el-button(
          type='danger'
          title="Полное удаление учётной записи абонента из билинга"
          icon='el-icon-close'
          @click="delCustomer"
        ) Удалить уч.
    el-dialog(
      title="Паспортные данные"
      :visible.sync="openPasportDlg"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    )
      passport(
        v-on:done="openPasportDlg=false"
      )
    el-dialog(
      title='Создание задачи'
      :visible.sync='taskFormDialog'
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    )
      task-form
    el-dialog(
      title='Пароль абонента'
      :visible.sync='openPasswordDlg'
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    )
      customer-password(
        :customerId="$store.state.customer.id"
        :initialPassw="$store.state.customer.raw_password"
        v-on:done="openPasswordDlg=false"
      )
    el-dialog(
      title="Принадлежность сайтам"
      :visible.sync="sitesDlg"
      :close-on-click-modal="false"
    )
      sites-attach(
        :selectedSiteIds="$store.state.customer.sites"
        v-on:save="customerSitesSave"
      )
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { mixins } from 'vue-class-component'
import { latinValidator, telephoneValidator } from '@/utils/validate'
import { ICustomerFrm, ICustomer } from '@/api/customers/types'
import { TaskModule } from '@/store/modules/tasks/tasks'
import TaskForm from '@/views/tasks/task-form.vue'
import { CustomerModule } from '@/store/modules/customers/customer'
import Passport from './passport.vue'
import CustomerPassword from './customer-password.vue'
// import GwsSelectfield from '@/views/gateways/gws-selectfield.vue'
import FormMixin from '@/utils/forms'
import TelsInput from './tels/tels-input.vue'
import CustomerFormFio from './customer-form-fio.vue'
import AddressChoice from '@/components/Address/address-choice.vue'
import GroupsChoice from '@/views/groups/groups-choice.vue'

@Component({
  name: 'customer-form',
  components: {
    TaskForm,
    Passport,
    CustomerPassword,
    TelsInput,
    CustomerFormFio,
    AddressChoice,
    GroupsChoice,
  }
})
export default class extends mixins(FormMixin) {
  private isLoading = false
  private openPasportDlg = false
  private openPasswordDlg = false
  private taskFormDialog = false
  private taskFormDialogLoading = false
  private sitesDlg = false

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

  private frmMod: ICustomerFrm = {} as ICustomerFrm

  created() {
    this.onChangedId()
  }

  @Watch('$store.state.customer', { deep: true })
  private onChangedId() {
    const frm = this.$store.state.customer as ICustomer
    this.frmMod = {
      username: frm.username,
      telephone: frm.telephone,
      fio: frm.fio,
      birth_day: frm.birth_day,
      group: frm.group,
      address: frm.address,
      house: frm.house,
      is_active: frm.is_active,
      is_dynamic_ip: frm.is_dynamic_ip,
      // gateway: frm.gateway,
      description: frm.description
    }
    this.frmInitial = Object.assign({}, this.frmMod) as ICustomerFrm
  }

  private onSubmit() {
    (this.$refs.customerfrm as Form).validate(async valid => {
      if (valid) {
        this.isLoading = true
        try {
          const newDat = await CustomerModule.PatchCustomer(this.frmMod)
          this.$emit('done', newDat)
          this.$message.success('Абонент сохранён')
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

  private delCustomer() {
    this.$confirm('Точно удалить учётку абонента? Вместе с ней удалится вся история следов пребывания учётки в билинге.', 'Внимание').then(async() => {
      try {
        const currLoc = this.$store.state.customer.address
        await CustomerModule.DelCustomer()
        this.$message.success('Учётка удалена')
        this.$router.push({ name: 'customersList', params: { localityId: currLoc.toString() } })
      } catch (err) {
        this.$message.error(err)
      }
    })
  }

  private async openTaskFormDialog() {
    this.taskFormDialogLoading = true
    try {
      const { data } = await TaskModule.GetNewTaskInitial({
        groupId: this.$store.state.customer.group,
        customerId: this.$store.state.customer.id
      })
      if (data.status > 0) {
        // Task with this customer does not exists, ok
        TaskModule.SET_CUSTOMER(CustomerModule.id)
        TaskModule.SET_CUSTOMER_FULLNAME(CustomerModule.full_name)
        this.taskFormDialog = true
      } else {
        // Task with this customer already exists, redirect to existing
        this.$message.warning({
          message: data.text,
          duration: 10000
        })
        if (data.task_id && data.task_id > 0) {
          this.$router.push({
            name: 'taskDetails',
            params: { taskId: data.task_id.toString() }
          })
        } else {
          this.$message.error('Task id expected from backend')
        }
      }
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.taskFormDialogLoading = false
    }
  }

  private customerSitesSave(selectedSiteIds: number[]) {
    CustomerModule.PatchCustomer({
      sites: selectedSiteIds
    }).then(() => {
      this.$message.success('Принадлежность абонента сайтам сохранена')
    })
    this.sitesDlg = false
  }
}
</script>
