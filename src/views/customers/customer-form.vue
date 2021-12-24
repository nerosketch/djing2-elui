<template>  
  <el-form ref="customerfrm" :label-width="$store.getters.isMobileView ? undefined : '125px'" status-icon :rules="frmRules" :model="frmMod" v-loading="isLoading">
    <customer-form-fio v-model="frmMod.fio"></customer-form-fio>
    <el-form-item :label="$t('customers.username')" prop="username">
      <el-input v-model="frmMod.username"></el-input>
    </el-form-item>
    <el-form-item :label="$t('customers.phone')" prop="telephone">
      <tels-input v-model="frmMod.telephone"></tels-input>
    </el-form-item>
    <el-form-item label="Дом (устар)">
      <el-input v-model="frmMod.house" :maxlength="12" readonly disabled></el-input>
    </el-form-item>
    <el-form-item :label="$t('customers.birthDay')" prop="birth_day">
      <el-date-picker v-model="frmMod.birth_day" type="date" value-format="yyyy-MM-dd" format="d.MM.yyyy"></el-date-picker>
    </el-form-item>
    <el-form-item :label="$t('groups.group')">
      <groups-choice v-model="frmMod.group"></groups-choice>
    </el-form-item>
    <el-form-item :label="$t('customers.options')">
      <el-checkbox v-model="frmMod.is_active">- {{ $t('customers.isActive') }}:
        <boolean-icon v-model="frmMod.is_active"></boolean-icon>
      </el-checkbox>
      <el-checkbox v-model="frmMod.is_dynamic_ip">- {{ $t('customers.dhcpDynamic') }}:
        <boolean-icon v-model="frmMod.is_dynamic_ip"></boolean-icon>
      </el-checkbox>
    </el-form-item>
    <el-form-item :label="$t('addrs.addr')">
      <addr-field-input v-model="frmMod.address"></addr-field-input>
    </el-form-item>
    <el-form-item :label="$t('customers.gateway')">
      <gws-selectfield v-model="frmMod.gateway"></gws-selectfield>
    </el-form-item>
    <el-form-item :label="$t('customers.additionalInfo')">
      <el-input v-model="frmMod.description" type="textarea" rows="5" cols="40"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button-group>
        <el-button type="primary" icon="el-icon-upload" @click="onSubmit" :loading="isLoading" :disabled="isFormUntouched">{{ $t('save') }}</el-button>
        <el-button type="success" icon="el-icon-plus" @click="openTaskFormDialog" :loading="taskFormDialogLoading">{{ $t('tasks.add') }}</el-button>
        <el-button @click="openPasportDlg = true" icon="el-icon-paperclip" :disabled="!$perms.customers.view_passportinfo">{{ $t('customers.passport') }}</el-button>
        <el-button @click="openPasswordDlg = true" icon="el-icon-lock">{{ $t('customers.password') }}</el-button>
        <el-button v-if="$perms.is_superuser" @click="sitesDlg = true" icon="el-icon-lock">{{ $t('customers.sites') }}</el-button>
        <el-button type="danger" :title="$t('customers.fullDelTitle')" icon="el-icon-close" @click="delCustomer">{{ $t('del') }}</el-button>
      </el-button-group>
    </el-form-item>
    <el-dialog :title="$t('customers.passportLong')" :visible.sync="openPasportDlg" :close-on-press-escape="false" :close-on-click-modal="false">
      <passport v-on:done="openPasportDlg=false"></passport>
    </el-dialog>
    <el-dialog :title="$t('tasks.adding')" :visible.sync="taskFormDialog" :close-on-press-escape="false" :close-on-click-modal="false">
      <task-form></task-form>
    </el-dialog>
    <el-dialog :title="$t('customers.passwordLong')" :visible.sync="openPasswordDlg" :close-on-press-escape="false" :close-on-click-modal="false">
      <customer-password :customerId="$store.state.customer.id" :initialPassw="$store.state.customer.raw_password" v-on:done="openPasswordDlg=false"></customer-password>
    </el-dialog>
    <el-dialog :title="$t('customers.sitesAccessory')" :visible.sync="sitesDlg" :close-on-click-modal="false">
      <sites-attach :selectedSiteIds="$store.state.customer.sites" v-on:save="customerSitesSave"></sites-attach>
    </el-dialog>
  </el-form>
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
import GwsSelectfield from '@/views/gateways/gws-selectfield.vue'
import FormMixin from '@/utils/forms'
import TelsInput from './tels/tels-input.vue'
import CustomerFormFio from './customer-form-fio.vue'
import GroupsChoice from '@/components/Groups/groups-choice.vue'
import AddrFieldInput from '@/components/Address/addr-field-input/index.vue'
import BooleanIcon from '@/components/boolean-icon.vue'

@Component({
  name: 'customer-form',
  components: {
    TaskForm,
    Passport,
    CustomerPassword,
    TelsInput,
    CustomerFormFio,
    AddrFieldInput,
    GroupsChoice,
    GwsSelectfield,
    BooleanIcon
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
      {
        required: true,
        message: this.$t('customers.usernameRequiredValidatorErrText'),
        trigger: 'blur'
      },
      {
        validator: latinValidator,
        trigger: 'change',
        message: this.$t('customers.usernameFilterValidatorErrText')
      }
    ],
    telephone: [
      { validator: telephoneValidator, trigger: 'change', message: '+[7,8,9,3] и 10,11 цифр' }
    ],
    birth_day: [
      {
        required: true,
        message: this.$t('customers.birthDayRequiredValidatorErrText'),
        trigger: 'blur'
      }
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
      birth_day: frm.birth_day!,
      group: frm.group,
      address: frm.address,
      house: frm.house,
      is_active: frm.is_active,
      is_dynamic_ip: frm.is_dynamic_ip,
      gateway: frm.gateway,
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
          this.$message.success(
            this.$t('customers.customerSavedOk').toString()
          )
        } catch (err) {
          this.$message.error(err)
        } finally {
          this.isLoading = false
        }
      } else {
        this.$message.error(this.$t('fixFormErrs').toString())
      }
    })
  }

  private delCustomer() {
    this.$confirm(
      this.$t('customers.customerDeletionConfigmation').toString(),
      this.$t('attention').toString()
    ).then(async() => {
      try {
        const currLoc = this.$store.state.customer.address
        await CustomerModule.DelCustomer()
        this.$message.success(
          this.$t('customers.accountRemovedOk').toString()
        )
        this.$router.push({ name: 'customerList', params: { addrId: currLoc.toString() } })
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
      this.$message.success(
        this.$t('customers.siteAccessorySavedOk').toString()
      )
    })
    this.sitesDlg = false
  }
}
</script>
