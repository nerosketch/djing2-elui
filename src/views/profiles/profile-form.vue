<template>  
  <el-form ref="frm" status-icon :rules="frmRules" :model="frmMod" v-loading="loading">
    <el-form-item label="Логин" prop="username">
      <el-input v-model="frmMod.username"></el-input>
    </el-form-item>
    <el-form-item label="ФИО" prop="fio">
      <el-input v-model="frmMod.fio"></el-input>
    </el-form-item>
    <el-form-item label="День рождения" prop="birth_day">
      <el-date-picker v-model="frmMod.birth_day" type="date" value-format="yyyy-MM-dd" format="d.MM.yyyy"></el-date-picker>
    </el-form-item>
    <el-form-item label="Включён">
      <el-switch v-model="frmMod.is_active"></el-switch><small>{{ frmMod.is_active ? '' : ' Если выключить учётку то её владелец не сможет заходить' }}</small>
    </el-form-item>
    <el-form-item label="Суперпользователь">
      <el-switch v-model="frmMod.is_superuser"></el-switch><small>{{ frmMod.is_superuser ? ' Если учётка имеет статус суперпользователя, то для неё не проверяются права, ей можно всё' : '' }}</small>
    </el-form-item>
    <el-form-item label="Номер телефона" prop="telephone">
      <el-input v-model="frmMod.telephone"></el-input>
    </el-form-item>
    <el-form-item label="ЭПочта" prop="email">
      <el-input v-model="frmMod.email"></el-input>
    </el-form-item>
    <el-form-item label="Пароль" prop="password" v-if="isNew">
      <el-input v-model="frmMod.password" type="password" autocomplete="new-password"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button-group>
        <el-button :type="isNew ? 'success' : 'primary'" @click="onSubmit" icon="el-icon-upload">{{ isNew ? 'Добавить' : 'Сохранить' }}</el-button>
        <template v-if="!isNew">
          <el-button @click="openPasswordForm" icon="el-icon-lock">Пароль</el-button>
          <template v-if="$perms.is_superuser">
            <el-button @click="openGroupsForm" icon="el-icon-lock">Группы пользователей</el-button>
            <el-button @click="sitesDlg = true" icon="el-icon-lock">Сайты</el-button>
          </template>
        </template>
      </el-button-group>
    </el-form-item>
    <el-dialog title="Поменять пароль" :visible.sync="passwordFormDialog" :close-on-click-modal="false">
      <password-form :profileId="$store.state.userprofile.id" v-on:done="passwordDone" v-on:cancel="passwordCancel"></password-form>
    </el-dialog>
    <el-dialog title="Назначить принадлежность группам пользователей" :visible.sync="userGroupAccessDialog" :close-on-click-modal="false">
      <profile-groups v-on:done="userGroupAccessDone"></profile-groups>
    </el-dialog>
    <el-dialog title="Принадлежность сайтам" :visible.sync="sitesDlg" :close-on-click-modal="false">
      <sites-attach :selectedSiteIds="$store.state.userprofile.sites" v-on:save="profileSitesSave"></sites-attach>
    </el-dialog>
  </el-form>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { latinValidator, telephoneValidator, emailValidator } from '@/utils/validate'
import { Form } from 'element-ui'
import { UserProfileModule } from '@/store/modules/profiles/user-profile'
import PasswordForm from './password-form.vue'
import ProfileGroups from './profile-groups.vue'
import { IUserProfile } from '@/api/profiles/types'

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
    return UserProfileModule.id === 0
  }

  @Watch('$store.state.userprofile', { deep: true })
  private onChProfileId(profile: IUserProfile) {
    this.frmMod.username = profile.username
    this.frmMod.fio = profile.fio
    this.frmMod.birth_day = profile.birth_day!
    this.frmMod.is_active = profile.is_active
    this.frmMod.is_superuser = profile.is_superuser || false
    this.frmMod.telephone = profile.telephone
    this.frmMod.email = profile.email
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
    (this.$refs.frm as Form).validate(async valid => {
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
          this.$emit('done', newDat)
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
