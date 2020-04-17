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
            el-tab-pane(label='Activity' name='activity' lazy)
              p activity
            el-tab-pane(label='Timeline' name='timeline' lazy)
              p timeline
            el-tab-pane(label='Account' name='account' lazy v-if="userProfile")
              keep-alive
                profile-form(:user='userProfile')

</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { IUserProfile } from '@/api/profiles/types'
import { getProfile } from '../../api/profiles/req'
import ProfileForm from './profile-form.vue'
import { UserProfileModule } from '../../store/modules/profiles/user-profile'
import UserCard from './UserCard.vue'

@Component({
  name: 'ProfileDetails',
  components: { ProfileForm, UserCard }
})
export default class extends Vue {
  @Prop({ default: '' }) private profileUname!: string

  private userProfile: IUserProfile = {
    token: UserProfileModule.token,
    pk: UserProfileModule.pk,
    username: UserProfileModule.username,
    fio: UserProfileModule.fio,
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
