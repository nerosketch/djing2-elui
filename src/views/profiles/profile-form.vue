<template lang="pug">
  el-form(
    ref='frm'
    size="mini"
    status-icon
    :rules='frmRules'
    :model='frmMod'
    v-loading='loading'
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
      label="Включён"
      prop='is_active'
    )
      el-switch(v-model="frmMod.is_active") {{ frmMod.is_active ? 'Да' : 'Нет' }}
    el-form-item(
      label="Номер телефона"
      prop='telephone'
    )
      el-input(v-model="frmMod.telephone")
    el-form-item(
      label="Номер телефона"
      prop='email'
    )
      el-input(v-model="frmMod.email")
    el-form-item
      el-button(type="primary" @click="onSubmit") Сохранить
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { latinValidator, telephoneValidator, emailValidator } from '@/utils/validate'
import { Form } from 'element-ui'
import { UserProfileModule } from '@/store/modules/profiles/user-profile'

@Component({
  name: 'ProfileForm'
})
export default class extends Vue {
  private loading = false
  private frmMod = {
    username: UserProfileModule.username,
    fio: UserProfileModule.fio,
    is_active: UserProfileModule.is_active,
    telephone: UserProfileModule.telephone,
    email: UserProfileModule.email
  }

  private frmRules = {
    username: [
      { required: true, message: 'Логин не может быть пустым', trigger: 'blur' },
      { validator: latinValidator, trigger: 'change', message: 'Логин может содержать латинские символы и цифры' }
    ],
    telephone: [
      { validator: telephoneValidator, trigger: 'change', message: '+[7,8,9,3] и 10,11 цифр' }
    ],
    email: [
      { validator: emailValidator, trigger: 'change', message: 'Не похоже на адрес почты' }
    ]
  }

  private onSubmit() {
    (this.$refs['frm'] as Form).validate(async valid => {
      if (valid) {
        this.loading = true
        const newDat = await UserProfileModule.PatchProfile(this.frmMod)
        this.loading = false
        this.$emit('done', newDat)
        this.$message.success('Учётка сохранена')
      } else {
        this.$message.error('Исправь ошибки в форме')
      }
    })
  }
}
</script>
