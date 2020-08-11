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

</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { IUserProfile } from '@/api/profiles/types'
import { UserProfileModule } from '@/store/modules/profiles/user-profile'
import ProfileForm from './profile-form.vue'
import UserCard from './UserCard.vue'
import GroupResponsibility from './group-responsibility.vue'
import ProfileLog from './profile-log.vue'

@Component({
  name: 'ProfileDetails',
  components: { ProfileForm, UserCard, GroupResponsibility, ProfileLog }
})
export default class extends Vue {
  @Prop({ default: '' }) private profileUname!: string

  private userProfile: IUserProfile = {
    pk: UserProfileModule.pk,
    username: UserProfileModule.username,
    fio: UserProfileModule.fio,
    birth_day: UserProfileModule.birth_day,
    is_active: UserProfileModule.is_active,
    is_admin: UserProfileModule.is_admin,
    telephone: UserProfileModule.telephone,
    avatar: UserProfileModule.avatar,
    email: UserProfileModule.email,
    full_name: UserProfileModule.full_name
  }
  private activeTab = 'activity'

  created() {
    this.loadProfile()
  }

  private async loadProfile() {
    if (this.profileUname) {
      this.userProfile = await UserProfileModule.GetProfile(this.profileUname)
    }
  }
}
</script>
