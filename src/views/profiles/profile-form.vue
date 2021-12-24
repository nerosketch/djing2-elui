<template lang="pug">
  el-form(
    ref="frm"
    status-icon
    :rules="frmRules"
    :model="frmMod"
    v-loading="loading")
    el-form-item(:label="$t('login')", prop="username")
      el-input(v-model="frmMod.username")
  
    el-form-item(:label="$t('fio')", prop="fio")
      el-input(v-model="frmMod.fio")
  
    el-form-item(:label="$t('den-rozhdeniya')", prop="birth_day")
      el-date-picker(
        v-model="frmMod.birth_day"
        type="date"
        value-format="yyyy-MM-dd"
        format="d.MM.yyyy")
  
    el-form-item(:label="$t('vklyuchyon')")
      el-switch(v-model="frmMod.is_active")
    
      small
        | {{ frmMod.is_active ? '' : ' Если выключить учётку то её владелец не сможет заходить' }}
  
    el-form-item(:label="$t('superpolzovatel')")
      el-switch(v-model="frmMod.is_superuser")
    
      small
        | {{ frmMod.is_superuser ? ' Если учётка имеет статус суперпользователя, то для неё не проверяются права, ей можно всё' : '' }}
  
    el-form-item(:label="$t('nomer-telefona')", prop="telephone")
      el-input(v-model="frmMod.telephone")
  
    el-form-item(:label="$t('epochta')", prop="email")
      el-input(v-model="frmMod.email")
  
    el-form-item(
      :label="$t('parol')"
      prop="password"
      v-if="isNew")
      el-input(
        v-model="frmMod.password"
        type="password"
        autocomplete="new-password")
  
    el-form-item
      el-button-group
        el-button(
          :type="isNew ? 'success' : 'primary'"
          @click="onSubmit"
          icon="el-icon-upload")
          | {{ isNew ? 'Добавить' : 'Сохранить' }}
      
        template(v-if="!isNew")
          el-button(@click="openPasswordForm", icon="el-icon-lock")
            | {{ $t('parol') }}
        
          template(v-if="$perms.is_superuser")
            el-button(@click="openGroupsForm", icon="el-icon-lock")
              | {{ $t('gruppy-polzovatelei') }}
          
            el-button(@click="sitesDlg = true", icon="el-icon-lock")
              | {{ $t('saity') }}
  
    el-dialog(
      :title="$t('pomenyat-parol')"
      :visible.sync="passwordFormDialog"
      :close-on-click-modal="false")
      password-form(
        :profileId="$store.state.userprofile.id"
        v-on:done="passwordDone"
        v-on:cancel="passwordCancel")
  
    el-dialog(
      :title="$t('naznachit-prinadlezhnost-gruppam-polzovatelei')"
      :visible.sync="userGroupAccessDialog"
      :close-on-click-modal="false")
      profile-groups(v-on:done="userGroupAccessDone")
  
    el-dialog(
      :title="$t('prinadlezhnost-saitam')"
      :visible.sync="sitesDlg"
      :close-on-click-modal="false")
      sites-attach(:selectedSiteIds="$store.state.userprofile.sites", v-on:save="profileSitesSave")
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
      { required: true, message: this.$t('login-ne-mozhet-byt-pustym'), trigger: 'blur' },
      { validator: latinValidator, trigger: 'change', message: this.$t('login-mozhet-soderzhat-latinskie-simvoly-i-cifry') }
    ],
    birth_day: [
      { required: true, message: this.$t('login-ne-mozhet-byt-pustym'), trigger: 'blur' }
    ],
    telephone: [
      { required: true, message: this.$t('nomer-telefona-obyazatelno'), trigger: 'blur' },
      { validator: telephoneValidator, trigger: 'change', message: this.$t('telValidation') }
    ],
    fio: [
      { required: true, message: this.$t('nuzhno-znat-kak-zovut-vladelca-uchyotki'), trigger: 'blur' }
    ],
    email: [
      { validator: emailValidator, trigger: 'change', message: this.$t('ne-pokhozhe-na-adres-pochty') }
    ],
    password: [
      { required: true, message: this.$t('parol-ne-mozhet-byt-pustym'), trigger: 'blur' },
      { validator: latinValidator, required: true, trigger: 'blur' },
      { min: 6, message: this.$t('parol-sostoit-minimum-iz-6ti-simvolov') }
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
            this.$message.success(this.$t('uchyotka-dobavlena'))
          } else {
            newDat = await UserProfileModule.PatchProfile(this.frmMod)
            this.$message.success(this.$t('uchyotka-sokhranena'))
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
    this.$message.success(this.$t('parol-uspeshno-izmenyon'))
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
      this.$message.success(this.$t('prinadlezhnost-uchyotnykh-zapisei-saitam-sokhranena'))
    })
    this.sitesDlg = false
  }
}
</script>
