<template lang="pug">
  .app-container
    el-row(:gutter="20")
      el-col(:span="6" :xs="24")
        user-card

      el-col(:span="18" :xs="24")
        tabs(
          :tabs="tabItems"
          :dense="true"
        )
          template
            profile-form(v-if="ready")

          template(#activity)
            group-responsibility(:profileUname="profileUname")

          template(
            #classperms
            v-if="$store.state.currentuserprofile.is_superuser"
          )
            user-class-perms

          template(
            #timeline
            v-if="ready"
          )
            profile-log

          template(
            #authlog
            v-if="ready"
          )
            profile-auth-log

</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { UserProfileModule } from '@/store/modules/profiles/user-profile'
import ProfileForm from './profile-form.vue'
import UserCard from './UserCard.vue'
import GroupResponsibility from './group-responsibility.vue'
import ProfileLog from './profile-log.vue'
import UserClassPerms from './user-class-perms.vue'
import ProfileAuthLog from './profile-auth-log.vue'
import Tabs, { ICustomTabItem } from '@/components/tabs/tabs.vue'

@Component({
  name: 'ProfileDetails',
  components: {
    ProfileForm,
    UserCard,
    GroupResponsibility,
    ProfileLog,
    UserClassPerms,
    Tabs,
    ProfileAuthLog
  }
})
export default class extends Vue {
  @Prop({ default: '' }) private profileUname!: string

  private ready = false

  private tabItems: ICustomTabItem[] = [
    { title: this.$t('change') },
    { name: 'activity', title: this.$t('profiles.responsibilityForGroups') },
    { name: 'classperms', title: this.$t('rightsToClassesOfAction') },
    { name: 'timeline', title: this.$t('actionLog') },
    { name: 'authlog', title: this.$t('authorizationLogs') }
  ]

  created() {
    this.loadProfile(this.profileUname)
  }

  @Watch('profileUname')
  private onChangeUname(uname: string) {
    this.loadProfile(uname)
  }

  private loadProfile(uname: string) {
    if (uname) {
      UserProfileModule.GetProfile(uname).then(profile => {
        document.title = profile.full_name || uname
        this.ready = true
      }).catch(() => {
        document.title = uname
      })
    }
  }
}
</script>
