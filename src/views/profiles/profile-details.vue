<template lang="pug">
  .app-container
    el-row(:gutter="20")
      el-col(
        :span="6"
        :xs="24"
      )
        user-card(:user="userProfile")
      el-col(
        :span="18"
        :xs="24"
      )
        el-card
          el-tabs(v-model='activeTab')
            el-tab-pane(label='Ответственность за группы' name='activity' lazy)
              group-responsibility(:profileUname='profileUname')
            el-tab-pane(label='Лог действий' name='timeline' lazy)
              keep-alive
                profile-log
            el-tab-pane(label='Изменить' name='account' lazy v-if="userProfile")
              keep-alive
                profile-form(:user='userProfile')
            el-tab-pane(label="Права на классы действий" v-if="isProfileSuperUser")
              keep-alive
                user-class-perms

</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { IUserProfile } from '@/api/profiles/types'
import { UserProfileModule } from '@/store/modules/profiles/user-profile'
import ProfileForm from './profile-form.vue'
import UserCard from './UserCard.vue'
import GroupResponsibility from './group-responsibility.vue'
import ProfileLog from './profile-log.vue'
import UserClassPerms from './user-class-perms.vue'
import ProfilesMixin from './profiles-mixin'

@Component({
  name: 'ProfileDetails',
  components: {
    ProfileForm,
    UserCard,
    GroupResponsibility,
    ProfileLog,
    UserClassPerms
  }
})
export default class extends mixins(ProfilesMixin) {
  @Prop({ default: '' }) private profileUname!: string

  private userProfile = this.profileStateGetter
  private activeTab = 'activity'

  created() {
    this.loadProfile()
  }

  @Watch('profileStateGetter', { deep: true })
  private onUserProfileChanged() {
    this.userProfile = Object.assign({}, this.profileStateGetter)
  }

  get profileStateGetter() {
    return {
      pk: UserProfileModule.pk,
      username: UserProfileModule.username,
      fio: UserProfileModule.fio,
      birth_day: UserProfileModule.birth_day,
      is_active: UserProfileModule.is_active,
      is_admin: UserProfileModule.is_admin,
      telephone: UserProfileModule.telephone,
      avatar: UserProfileModule.avatar,
      email: UserProfileModule.email,
      full_name: UserProfileModule.full_name,
      is_superuser: UserProfileModule.is_superuser,
      access_level: UserProfileModule.access_level
    }
  }

  private loadProfile() {
    if (this.profileUname) {
      UserProfileModule.GetProfile(this.profileUname).then(profile => {
        document.title = profile.full_name || this.profileUname
      }).catch(() => {
        document.title = this.profileUname
      })
    }
  }
}
</script>
