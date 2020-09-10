import { Module, Mutation, Action, getModule, VuexModule } from 'vuex-module-decorators'
import store from '@/store'
import { getToken, setToken, removeToken } from '@/utils/cookies'
import { getSelfProfile, login, changeProfile } from '@/api/profiles/req'
import { IUserProfile } from '@/api/profiles/types'

@Module({ dynamic: true, store, name: 'currentuserprofile' })
class CurrentUserProfile extends VuexModule implements IUserProfile {
  public pk = 0
  public token = getToken() || ''
  public username = ''
  public fio = ''
  public birth_day = ''
  public is_active = false
  public is_admin = false
  public telephone = ''
  public avatar = ''
  public email = ''
  public full_name = ''
  public last_login = ''
  public is_superuser = false
  public user_permissions: number[] = []
  public groups: number[] = []

  @Mutation
  public SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  public SET_ALL_CURRENT_PROFILE(data: IUserProfile) {
    this.username = data.username
    this.fio = data.fio
    this.birth_day = data.birth_day
    this.is_active = data.is_active
    this.is_admin = data.is_admin
    this.telephone = data.telephone
    this.avatar = data.avatar
    this.email = data.email
    this.full_name = data.full_name!
    this.last_login = data.last_login!
    this.is_superuser = data.is_superuser!
    this.user_permissions = data.user_permissions
    this.groups = data.groups
  }

  @Mutation
  public RESET_ALL_CURRENT_PROFILE() {
    this.token = ''
    this.username = ''
    this.fio = ''
    this.birth_day = ''
    this.is_active = false
    this.is_admin = false
    this.telephone = ''
    this.avatar = ''
    this.email = ''
    this.full_name = ''
    this.last_login = ''
    this.is_superuser = false
    this.user_permissions = []
    this.groups = []
  }

  public get getCurrentAvatar(): string {
    if (this.avatar) {
      return this.avatar
    } else {
      return '/img/user_ava_min.gif'
    }
  }

  public get isAvatar() {
    return Boolean(this.avatar)
  }

  @Action
  public async GetSelf() {
    if (this.token === '') {
      throw Error('GetUserInfo: token is undefined!')
    }
    const { data } = await getSelfProfile()
    if (!data) {
      throw Error('Verification failed, please Login again.')
    }
    this.SET_ALL_CURRENT_PROFILE(data)
    return data
  }

  @Action
  public async Login(userInfo: { username: string, password: string }) {
    userInfo.username = userInfo.username.trim()
    const { data } = await login(userInfo)
    setToken(data.token)
    this.SET_TOKEN(data.token)
    await this.GetSelf()
  }

  @Action
  public ResetToken() {
    removeToken()
    this.SET_TOKEN('')
  }

  @Action
  public async LogOut() {
    if (!this.token) {
      throw Error('LogOut: token is undefined!')
    }
    // await logout()
    removeToken()
    this.SET_TOKEN('')
    this.RESET_ALL_CURRENT_PROFILE()
  }

  @Action
  public async PatchPermissions(info: object) {
    const { data } = await changeProfile(this.username, info)
    this.SET_ALL_CURRENT_PROFILE(data as IUserProfile)
    return data
  }

  // public HasPermission(permCodeName: string): boolean {
  //   if (this.is_superuser) return true
  //   if (this.user_permissions) {
  //     let up = this.user_permissions.find(up => up.codename === permCodeName)
  //     return Boolean(up)
  //   }
  //   return false
  // }
}
export const CurrentUserProfileModule = getModule(CurrentUserProfile)
