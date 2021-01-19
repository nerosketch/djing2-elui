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
      label="День рождения"
      prop='birth_day'
    )
      el-date-picker(
        v-model="frmMod.birth_day"
        type="date"
        value-format="yyyy-MM-dd"
        format="d MMM yyyy"
      )
    el-form-item(
      label="Включён"
      prop='is_active'
    )
      el-switch(v-model="frmMod.is_active")
      small {{ frmMod.is_active ? '' : ' Если выключить учётку то её владелец не сможет заходить' }}
    el-form-item(
      label="Суперпользователь"
      prop='is_superuser'
    )
      el-switch(v-model="frmMod.is_superuser")
      small {{ frmMod.is_superuser ? ' Если учётка имеет статус суперпользователя, то для неё не проверяются права, ей можно всё' : '' }}
    el-form-item(
      label="Номер телефона"
      prop='telephone'
    )
      el-input(v-model="frmMod.telephone")
    el-form-item(
      label="ЭПочта"
      prop='email'
    )
      el-input(v-model="frmMod.email")
    el-form-item(
      label="Пароль"
      prop='password'
      v-if="isNew"
    )
      el-input(v-model="frmMod.password" type="password" autocomplete="new-password")
    el-form-item
      el-button-group
        el-button(
          :type="isNew ? 'success' : 'primary'"
          @click="onSubmit"
          icon='el-icon-upload'
        ) {{ isNew ? 'Добавить' : 'Сохранить' }}
        template(v-if="!isNew")
          el-button(@click="openPasswordForm" icon="el-icon-lock") Пароль
          template(v-if="$perms.is_superuser")
            el-button(@click="openGroupsForm" icon="el-icon-lock") Группы пользователей
            el-button(
              @click="sitesDlg = true"
              icon='el-icon-lock'
            ) Сайты

    el-dialog(
      title="Поменять пароль"
      :visible.sync="passwordFormDialog"
    )
      password-form(
        :profileId="$store.state.userprofile.pk"
        v-on:done="passwordDone"
        v-on:cancel="passwordCancel"
      )

    el-dialog(
      title="Назначить принадлежность группам пользователей"
      :visible.sync="userGroupAccessDialog"
    )
      profile-groups(
        v-on:done="userGroupAccessDone"
      )
    el-dialog(
      title="Принадлежность сайтам"
      :visible.sync="sitesDlg"
    )
      sites-attach(
        :selectedSiteIds="$store.state.userprofile.sites"
        v-on:save="profileSitesSave"
      )

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { latinValidator, telephoneValidator, emailValidator } from '@/utils/validate'
import { Form } from 'element-ui'
import { UserProfileModule } from '@/store/modules/profiles/user-profile'
import PasswordForm from './password-form.vue'
import ProfileGroups from './profile-groups.vue'

@Component({
  name: 'ProfileForm',
  components: { PasswordForm, ProfileGroups }
})
export default class extends Vue {
  private loading = false
  private passwordFormDialog = false
  private userGroupAccessDialog = false
  private sitesDlg = false
  private frmMod = {
    username: UserProfileModule.username,
    fio: UserProfileModule.fio,
    birth_day: UserProfileModule.birth_day,
    is_active: this.isNew ? true : UserProfileModule.is_active,
    is_superuser: this.isNew ? false : UserProfileModule.is_superuser,
    telephone: UserProfileModule.telephone,
    email: UserProfileModule.email,
    password: undefined
  }

  private get isNew() {
    return UserProfileModule.pk === 0
  }

  private frmRules = {
    username: [
      { required: true, message: 'Логин не может быть пустым', trigger: 'blur' },
      { validator: latinValidator, trigger: 'change', message: 'Логин может содержать латинские символы и цифры' }
    ],
    birth_day: [
      { required: true, message: 'Логин не может быть пустым', trigger: 'blur' }
    ],
    telephone: [
      { required: true, message: 'Номер телефона обязательно', trigger: 'blur' },
      { validator: telephoneValidator, trigger: 'change', message: '+[7,8,9,3] и 10,11 цифр' }
    ],
    fio: [
      { required: true, message: 'Нужно знать как зовут владельца учётки', trigger: 'blur' }
    ],
    email: [
      { validator: emailValidator, trigger: 'change', message: 'Не похоже на адрес почты' }
    ],
    password: [
      { required: true, message: 'Пароль не может быть пустым', trigger: 'blur' },
      { validator: latinValidator, required: true, trigger: 'blur' },
      { min: 6, message: 'Пароль состоит минимум из 6ти символов' }
    ]
  }

  private onSubmit() {
    (this.$refs['frm'] as Form).validate(async valid => {
      if (valid) {
        this.loading = true
        let newDat
        try {
          if (this.isNew) {
            newDat = await UserProfileModule.AddProfile(this.frmMod)
            this.$message.success('Учётка добавлена')
          } else {
            newDat = await UserProfileModule.PatchProfile(this.frmMod)
            this.$message.success('Учётка сохранена')
          }
          this.loading = false
          this.$emit('done', newDat)
        } catch (err) {
          this.$message.error(err)
          this.loading = false
        }
      } else {
        this.$message.error('Исправь ошибки в форме')
      }
    })
  }

  private openPasswordForm() {
    this.passwordFormDialog = true
  }

  private passwordDone() {
    this.$message.success('Пароль успешно изменён')
    this.passwordFormDialog = false
  }
  private passwordCancel() {
    this.passwordFormDialog = false
  }

  private openGroupsForm() {
    this.userGroupAccessDialog = true
  }

  private userGroupAccessDone() {
    this.userGroupAccessDialog = false
  }

  private profileSitesSave(selectedSiteIds: number[]) {
    UserProfileModule.PatchProfile({
      sites: selectedSiteIds
    }).then(() => {
      this.$message.success('Принадлежность учётных записей сайтам сохранена')
    })
    this.sitesDlg = false
  }
}
</script>
