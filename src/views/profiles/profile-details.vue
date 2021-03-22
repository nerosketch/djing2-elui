<template lang="pug">
  .app-container
    el-row(:gutter="20")
      el-col(
        :span="6"
        :xs="24"
      )
        user-card
      el-col(
        :span="18"
        :xs="24"
      )
        el-card
          el-tabs(v-model='activeTab')
            el-tab-pane(label='Изменить' name='account')
              keep-alive
                profile-form
            el-tab-pane(label='Ответственность за группы' name='activity' lazy)
              group-responsibility(:profileUname='profileUname')
            el-tab-pane(label="Права на классы действий" v-if="$store.state.currentuserprofile.is_superuser" lazy)
              keep-alive
                user-class-perms
            el-tab-pane(label='Лог действий' name='timeline' lazy)
              keep-alive
                profile-log
            el-tab-pane(label='Лог авторизаций' name='authlog' lazy)
              keep-alive
                profile-auth-log
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { UserProfileModule } from '@/store/modules/profiles/user-profile'
import ProfileForm from './profile-form.vue'
import UserCard from './UserCard.vue'
import GroupResponsibility from './group-responsibility.vue'
import ProfileLog from './profile-log.vue'
import UserClassPerms from './user-class-perms.vue'
import ProfileAuthLog from './profile-auth-log.vue'

@Component({
  name: 'ProfileDetails',
  components: {
    ProfileForm,
    UserCard,
    GroupResponsibility,
    ProfileLog,
    UserClassPerms,
    ProfileAuthLog
  }
})
export default class extends Vue {
  @Prop({ default: '' }) private profileUname!: string

  private activeTab = 'account'

  created() {
    this.loadProfile()
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
