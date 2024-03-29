<template lang="pug">
  el-form(
    ref="frm"
    v-loading="loading"
    status-icon
    :rules="frmRules"
    :model="frmMod")
    el-form-item(:label="$t('customers.phone')" prop="telephone")
      el-input(v-model="frmMod.telephone" :maxlength="16")

    el-form-item(:label="$t('customers.phoneOwner')" prop="owner_name")
      el-input(v-model="frmMod.owner_name" :maxlength="127")

    el-form-item
      el-button(
        icon="el-icon-upload"
        type="primary"
        @click="onSubmit"
        :loading="loading"
        :disabled="!$perms.customers.add_additionaltelephone")
        | {{ isNew ? $t('add') : $t('save') }}
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { telephoneValidator } from '@/utils/validate'
import { AdditionalTelephoneModule } from '@/store/modules/customers/telephones'

@Component({
  name: 'TelForm'
})
export default class extends Vue {
  @Prop({ required: true })
  private customer!: number

  private loading = false

  private frmMod = {
    owner_name: '',
    telephone: ''
  }

  private frmRules = {
    owner_name: [
      {
        required: true,
        message: this.$tc('customers.contactNameRequired'),
        trigger: 'blur'
      }
    ],
    telephone: [
      {
        required: true,
        message: this.$tc('customers.contactPhoneRequired'),
        trigger: 'blur'
      },
      {
        validator: telephoneValidator,
        trigger: 'change',
        message: this.$tc('customers.contactPhoneRequired')
      }
    ]
  }

  get isNew() {
    return AdditionalTelephoneModule.id === 0
  }

  private onSubmit() {
    (this.$refs.frm as Form).validate(async valid => {
      if (valid) {
        this.loading = true
        let tel
        try {
          const dat = Object.assign(this.frmMod, { customer_id: this.customer })
          if (this.isNew) {
            tel = await AdditionalTelephoneModule.AddTelephone(dat)
            this.$message.success(
              this.$tc('customers.contactPhoneSaved')
            )
          } else {
            tel = await AdditionalTelephoneModule.PatchTelephone(dat)
            this.$message.success(
              this.$tc('customers.contactPhoneChanged')
            )
          }
          this.$emit('done', tel)
        } finally {
          this.loading = false
        }
      } else {
        this.$message.error(this.$tc('fixFormErrs'))
      }
    })
  }
}
</script>
