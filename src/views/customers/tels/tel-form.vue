<template>  
  <el-form ref="frm" v-loading="loading" status-icon :rules="frmRules" :model="frmMod">
    <el-form-item :label="$t('customers.phone')" prop="telephone">
      <el-input v-model="frmMod.telephone" :maxlength="16"></el-input>
    </el-form-item>
    <el-form-item :label="$t('customers.phoneOwner')" prop="owner_name">
      <el-input v-model="frmMod.owner_name" :maxlength="127"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button icon="el-icon-upload" type="primary" @click="onSubmit" :loading="loading" :disabled="!$perms.customers.add_additionaltelephone">{{ isNew ? $t('add') : $t('save') }}</el-button>
    </el-form-item>
  </el-form>
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
        message: this.$t('customers.contactNameRequired').toString(),
        trigger: 'blur'
      }
    ],
    telephone: [
      {
        required: true,
        message: this.$t('customers.contactPhoneRequired').toString(),
        trigger: 'blur'
      },
      { validator: telephoneValidator, trigger: 'change' }
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
          const dat = Object.assign(this.frmMod, { customer: this.customer })
          if (this.isNew) {
            tel = await AdditionalTelephoneModule.AddTelephone(dat)
            this.$message.success(
              this.$t('customers.contactPhoneSaved').toString()
            )
          } else {
            tel = await AdditionalTelephoneModule.PatchTelephone(dat)
            this.$message.success(
              this.$t('customers.contactPhoneChanged').toString()
            )
          }
          this.$emit('done', tel)
        } catch (err) {
          this.$message.error(err)
        } finally {
          this.loading = false
        }
      } else {
        this.$message.error(this.$t('fixFormErrs').toString())
      }
    })
  }
}
</script>
