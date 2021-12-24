<template>  
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <user-card></user-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <el-tabs v-model="activeTabName">
            <el-tab-pane :label="$t('change')" name="account">
              <profile-form v-if="ready"></profile-form>
            </el-tab-pane>
            <el-tab-pane label="Ответственность за группы" name="activity" lazy>
              <group-responsibility :profileUname="profileUname"></group-responsibility>
            </el-tab-pane>
            <el-tab-pane label="Права на классы действий" v-if="$store.state.currentuserprofile.is_superuser" name="classperms" lazy>
              <keep-alive v-if="ready">
                <user-class-perms></user-class-perms>
              </keep-alive>
            </el-tab-pane>
            <el-tab-pane label="Лог действий" name="timeline" lazy>
              <keep-alive v-if="ready">
                <profile-log></profile-log>
              </keep-alive>
            </el-tab-pane>
            <el-tab-pane label="Лог авторизаций" name="authlog" lazy>
              <keep-alive v-if="ready">
                <profile-auth-log></profile-auth-log>
              </keep-alive>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import TabMixin from '@/utils/tab-mixin'
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
export default class extends mixins(TabMixin) {
  @Prop({ default: '' }) private profileUname!: string

  protected activeTabName = 'account'
  private ready = false

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
