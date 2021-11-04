<template lang="pug">
el-form(
  ref='frm'
  v-loading='loading'
  status-icon
  :rules='frmRules'
  :model='frmMod'
)
  el-form-item(
    label="Номер телефона"
    prop='telephone'
  )
    el-input(v-model="frmMod.telephone" :maxlength='16')
  el-form-item(
    label="Владелец телефона"
    prop='owner_name'
  )
    el-input(v-model="frmMod.owner_name" :maxlength='127')
  el-form-item
    el-button(
      icon='el-icon-upload'
      type="primary" @click="onSubmit"
      :loading="loading"
      :disabled="!$perms.customers.add_additionaltelephone"
    ) {{ isNew ? 'Добавить' : 'Сохранить' }}
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
      { required: true, message: 'Какое имя у контакта?', trigger: 'blur' }
    ],
    telephone: [
      { required: true, message: 'Нужен номер телефона', trigger: 'blur' },
      { validator: telephoneValidator, trigger: 'change', message: '+[7,8,9,3] и 10,11 цифр' }
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
            this.$message.success('Телефон сохранён')
          } else {
            tel = await AdditionalTelephoneModule.PatchTelephone(dat)
            this.$message.success('Телефон изменён')
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
