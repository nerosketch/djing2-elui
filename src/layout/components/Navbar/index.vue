<template lang="pug">
  .navbar
    hamburger.hamburger-container(
      :is-active="$store.state.app.sidebar.opened"
      @toggleClick="toggleSideBar"
    )

    form.center-header(
      @submit.prevent="doSearch"
    )
      el-input(
        v-model="searchStr"
        placeholder="Поиск"
        prefix-icon="el-icon-search"
        size="small"
      )
        template(v-slot:append)
          el-button(
            icon="el-icon-search"
            @click="doSearch"
          )

    .right-menu
      el-dropdown.avatar-container.right-menu-item.hover-effect(
        trigger="click"
      )
        .avatar-wrapper
          img.user-avatar(
            v-if="$store.getters.isAvatar"
            :src="avatar"
          )
          span(v-else) {{ profileUname }}
          i.el-icon-caret-bottom
        template(v-slot:dropdown)
          el-dropdown-menu
            router-link(to="/customers")
              el-dropdown-item Домашняя
            router-link(to="/reports")
              el-dropdown-item Отчёты
            router-link(to="/sites" v-if="$perms.is_superuser")
              el-dropdown-item Домены
            router-link(to='/messenger')
              el-dropdown-item Мессенжеры
            el-dropdown-item(divided)
              span(
                style="display:block;"
                @click="logout"
              ) Выйти
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { AppModule } from '@/store/modules/app'
import Hamburger from '@/components/Hamburger/index.vue'
import { SearchModule } from '@/store/modules/search'
import { CurrentUserProfileModule } from '@/store/modules/profiles/current-user-profile'
import { IUserProfile } from '@/api/profiles/types'
import { CurrentPermissions } from '@/store/current-user-permissions'
import Ws from '@/layout/mixin/ws'

@Component({
  name: 'Navbar',
  components: {
    Hamburger
  }
})
export default class extends mixins(Ws) {
  private $perms!: CurrentPermissions
  private searchStr = ''

  get avatar() {
    if (!CurrentUserProfileModule.isAvatar) {
      CurrentUserProfileModule.GetSelf().then((profile: IUserProfile) => {
        this.$perms.SET_IS_SUPERUSER(profile.is_superuser || false)
      })
      this.$perms.GetCurrentAuthPermissions()
    }
    return CurrentUserProfileModule.getCurrentAvatar
  }

  get profileUname() {
    return CurrentUserProfileModule.username || CurrentUserProfileModule.full_name
  }

  private toggleSideBar() {
    AppModule.ToggleSideBar(false)
  }

  private async logout() {
    await CurrentUserProfileModule.LogOut()
    this.$router.push(`/login?redirect=${this.$route.fullPath}`)
  }

  private async doSearch() {
    await SearchModule.DoSearch(this.searchStr)
    if (this.$route.path !== '/search/') {
      this.$router.push({ name: 'searchPlace' })
    }
  }

  created() {
    CurrentUserProfileModule.GetSelf().then((profile: IUserProfile) => {
      this.$perms.SET_IS_SUPERUSER(profile.is_superuser || false)
    })
    this.$perms.GetCurrentAuthPermissions()

    // Question about push subscription
    if (!this.$messagingMng.wasThereQuestion()) {
      this.$confirm('Вы хотите получать уведомления из билинга?', 'Уведомления', {
        type: 'info',
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        confirmButtonText: 'Да',
        cancelButtonText: 'Нет'
      }).then(() => {
        this.pushSubscribe()
      }).catch(() => {
        this.$confirm('Точно не нужно? Можно пропустить всё важное и интересное :)', {
          type: 'info',
          showClose: false,
          confirmButtonText: 'Ладно',
          cancelButtonText: 'Точно нет!'
        }).then(() => {
          this.pushSubscribe()
        }).catch(() => {
          this.$messagingMng.setQuestionAnswer(false)
        })
      })
    }
  }

  private pushSubscribe() {
    this.$messagingMng.toggleSubscribe()
  }
}
</script>

<style lang="scss">
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    padding: 0 15px;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

.center-header {
  display: inline-block;
  width: 60%;
  line-height: 50px;
  margin-left: 2%;
}
</style>
