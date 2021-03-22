<template lang="pug">
  el-form(
    ref='customerfrm'
    :label-width="isMobileView ? undefined : '115px'"
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
      tels-input(v-model="frmMod.telephone")
    el-form-item(
      label="Улица"
      prop='street'
      v-loading="isStreetLoading"
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
        format="d.MM.yyyy"
      )
    el-form-item(
      label="Опции"
    )
      el-checkbox(v-model="frmMod.is_active") - Активный: {{ frmMod.is_active ? 'Да' : 'Нет' }}
      el-checkbox(v-model="frmMod.is_dynamic_ip") - Динамические настройки по dhcp: {{ frmMod.is_dynamic_ip ? 'Да' : 'Нет' }}
    el-form-item(
      label="Группа"
      prop='group'
      v-loading="isGroupLoading"
    )
      el-select(v-model="frmMod.group" :disabled="groups.length == 0")
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
        :customerId="$store.state.customer.pk"
        :initialPassw="$store.state.customer.raw_password"
        v-on:done="openPasswordDlg=false"
      )
    el-dialog(
      title="Принадлежность сайтам"
      :visible.sync="sitesDlg"
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
import { AppModule } from '@/store/modules/app'
import { ICustomerStreet, ICustomerGroup, ICustomerFrm } from '@/api/customers/types'
import { getStreets, getCustomerGroups } from '@/api/customers/req'
import { TaskModule } from '@/store/modules/tasks/tasks'
import TaskForm from '@/views/tasks/task-form.vue'
import { CustomerModule } from '@/store/modules/customers/customer'
import Passport from './passport.vue'
import CustomerPassword from './customer-password.vue'
import GwsSelectfield from '@/views/gateways/gws-selectfield.vue'
import FormMixin from '@/utils/forms'
import TelsInput from './tels/tels-input.vue'

@Component({
  name: 'customer-form',
  components: {
    TaskForm,
    GwsSelectfield,
    Passport,
    CustomerPassword,
    TelsInput
  }
})
export default class extends mixins(FormMixin) {
  private isLoading = false
  private isStreetLoading = false
  private isGroupLoading = false
  private customerStreets: ICustomerStreet[] = []
  private groups: ICustomerGroup[] = []
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
    ]
  }

  private get isMobileView() {
    return AppModule.IsMobileDevice
  }
  private frmMod: ICustomerFrm = {} as ICustomerFrm

  created() {
    this.loadGroups()
    this.loadStreets()
    this.onChangedId()
  }

  @Watch('$store.state.customer.pk')
  private onChangedId() {
    this.frmMod = {
      username: CustomerModule.username,
      telephone: CustomerModule.telephone,
      fio: CustomerModule.fio,
      birth_day: CustomerModule.birth_day,
      group: CustomerModule.group,
      street: CustomerModule.street === 0 ? null : CustomerModule.street,
      house: CustomerModule.house,
      is_active: CustomerModule.is_active,
      is_dynamic_ip: CustomerModule.is_dynamic_ip,
      gateway: CustomerModule.gateway,
      description: CustomerModule.description
    }
    this.frmInitial = Object.assign({}, this.frmMod) as ICustomerFrm
  }

  @Watch('$store.state.customer.group')
  private onChangedGroup() {
    this.loadStreets()
  }

  private async loadStreets() {
    this.isStreetLoading = true
    try {
      const { data } = await getStreets({
        page: 1,
        page_size: 0,
        group: this.$store.state.customer.group
      }) as any
      this.customerStreets = data
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.isStreetLoading = false
    }
  }

  private async loadGroups() {
    this.isGroupLoading = true
    try {
      const { data } = await getCustomerGroups() as any
      this.groups = data
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.isGroupLoading = false
    }
  }

  private onSubmit() {
    (this.$refs['customerfrm'] as Form).validate(async valid => {
      if (valid) {
        this.isLoading = true
        try {
          const newDat = await CustomerModule.PatchCustomer(this.frmMod)
          this.$emit('done', newDat)
          this.frmInitial = Object.assign({}, {
            username: newDat.username,
            telephone: newDat.telephone,
            fio: newDat.fio,
            group: newDat.group,
            street: newDat.street,
            house: newDat.house,
            is_active: newDat.is_active,
            is_dynamic_ip: newDat.is_dynamic_ip,
            gateway: newDat.gateway,
            description: newDat.description
          })
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
        const currGroup = this.$store.state.customer.group
        await CustomerModule.DelCustomer()
        this.$message.success('Учётка удалена')
        this.$router.push({ name: 'customersList', params: { groupId: currGroup.toString() } })
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
        customerId: CustomerModule.pk
      })
      if (data.status > 0) {
        // Task with this customer does not exists, ok
        TaskModule.SET_CUSTOMER(CustomerModule.pk)
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
