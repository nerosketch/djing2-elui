<template lang="pug">
  .login-container
    el-form.login-form(
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      autocomplete="on"
      label-position="left"
    )
      glsl-smog-effect(id="smogblock" :width="518" :height="231")
        //- h3.title Войти

      el-form-item(prop="username")
        span.svg-container
          i.el-icon-user-solid
      
        el-input(
          ref="username"
          v-model="loginForm.username"
          name="username"
          type="text"
          autocomplete="on"
          placeholder="$t('login-0')")
    
      el-form-item(prop="password")
        span.svg-container
          i.el-icon-lock
      
        el-input(
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="$t('parol')"
          name="password"
          autocomplete="on"
          @keyup.enter.native="handleLogin")
      
        span.show-pwd(@click="showPwd")
          i(:class="passwordType === 'password' ? 'el-icon-view' : 'el-icon-close'")

      el-button#loginbtn(
        :loading="loading"
        @click.native.prevent="handleLogin"
      ) {{ $t('voiti-0') }}

</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { Dictionary } from 'vue-router/types/router'
import { Form as ElForm, Input } from 'element-ui'
import { latinValidator } from '@/utils/validate'
import { CurrentUserProfileModule } from '@/store/modules/profiles/current-user-profile'
import { IUserProfile } from '@/api/profiles/types'
import { CurrentPermissions } from '@/store/current-user-permissions'
import GlslSmogEffect from '@/components/shaders/glsl-smog-effect.vue'

@Component({
  name: 'Login',
  components: { GlslSmogEffect }
})
export default class extends Vue {
  private $perms!: CurrentPermissions
  private loginForm = {
    username: '',
    password: ''
  }

  private loginRules = {
    username: [
      { required: true, message: this.$t('login-ne-mozhet-byt-pustym'), trigger: 'blur' },
      { validator: latinValidator, trigger: 'change', message: this.$t('nuzhen-login-iz-latinskikh-simvolov-i-cifr') }
    ],
    password: [
      { required: true, message: this.$t('parol-ne-mozhet-byt-pustym'), trigger: 'blur' },
      { validator: latinValidator, required: true, trigger: 'blur' },
      { min: 6, message: this.$t('parol-sostoit-minimum-iz-6ti-simvolov') }
    ]
  }

  private passwordType = 'password'
  private loading = false
  // private showDialog = false
  private redirect?: string
  private otherQuery: Dictionary<string> = {}

  @Watch('$route', { immediate: true })
  private onRouteChange(route: Route) {
    // TODO: remove the "as Dictionary<string>" hack after v4 release for vue-router
    // See https://github.com/vuejs/vue-router/pull/2050 for details
    const query = route.query as Dictionary<string>
    if (query) {
      this.redirect = query.redirect
      this.otherQuery = this.getOtherQuery(query)
    }
  }

  mounted() {
    if (this.loginForm.username === '') {
      (this.$refs.username as Input).focus()
    } else if (this.loginForm.password === '') {
      (this.$refs.password as Input).focus()
    }
  }

  created() {
    document.title = this.$t('vkhod')
  }

  private showPwd() {
    if (this.passwordType === 'password') {
      this.passwordType = ''
    } else {
      this.passwordType = 'password'
    }
    this.$nextTick(() => {
      (this.$refs.password as Input).focus()
    })
  }

  private handleLogin() {
    (this.$refs.loginForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.loading = true
        try {
          await CurrentUserProfileModule.Login(this.loginForm)
          CurrentUserProfileModule.GetSelf().then((profile: IUserProfile) => {
            this.$perms.SET_IS_SUPERUSER(profile.is_superuser || false)
          })
          this.$perms.GetCurrentAuthPermissions()
          this.$router.push({
            path: this.redirect || '/',
            query: this.otherQuery
          })
        } finally {
          this.loading = false
        }
      } else {
        return false
      }
    })
  }

  private getOtherQuery(query: Dictionary<string>) {
    return Object.keys(query).reduce((acc, cur) => {
      if (cur !== 'redirect') {
        acc[cur] = query[cur]
      }
      return acc
    }, {} as Dictionary<string>)
  }
}
</script>

<style lang="scss">
// References: https://www.zhangxinxu.com/wordpress/2018/01/css-caret-color-first-line/
@supports (-webkit-mask: none) and (not (cater-color: $loginCursorColor)) {
  .login-container .el-input {
    input { color: $loginCursorColor; }
    input::first-line { color: $lightGray; }
  }
}

.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      height: 47px;
      background: transparent;
      border: 0px;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $lightGray;
      caret-color: $loginCursorColor;
      -webkit-appearance: none;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $loginBg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  width: 100%;
  background-color: $loginBg;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 0;
    margin: 0 auto;
    border: 1px #444e5a solid;
    top: 15%;
    background-color: #00000030;
    box-shadow: 3px 5px 7px 3px rgb(0 0 0 / 22%);
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $darkGray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  // .title-container {
  //   position: fixed;

  //   .title {
  //     font-size: 26px;
  //     color: $lightGray;
  //     margin: -52px auto 23px auto;
  //     text-align: center;
  //     font-weight: bold;
  //   }
  // }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 16px;
    color: $darkGray;
    cursor: pointer;
    user-select: none;
  }
}

#smogblock {
  position: fixed;
  margin: -35px 0 0 -35px;
  width: 518px;
  height: 227px;
}
#loginbtn {
  position: relative;
  width: 100%;
  margin-bottom: 30px;
  background-color: #3c4c60e3;
  border-color: #636f81;
  color: aliceblue;
}
</style>
