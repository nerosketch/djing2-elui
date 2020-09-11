import { Module, getModule, VuexModule, MutationAction } from 'vuex-module-decorators'
import store from '@/store'
import { getCurrentAuthPermissions } from '@/api/profiles/req'

export class CurrentPermissions extends VuexModule {
  public is_superuser = false
  public current_auth_permissions: string[] = []

  public customers = {
    add_customer: false,
    change_customer: false,
    delete_customer: false,
    add_customerstreet: true,
    change_customerstreet: false,
    delete_customerstreet: false
  }

  @MutationAction({ mutate:  ['current_auth_permissions']})
  public async GetCurrentAuthPermissions() {
    const res = await getCurrentAuthPermissions()
    return {
    current_auth_permissions: res.data
    }
  }
}

@Module({ dynamic: true, store, name: 'perms' })
class CurrentPermissionsMod extends CurrentPermissions {}

export const CurrentPermissionsModule = getModule(CurrentPermissionsMod)

// export const HasPermission = (permCodeName: string): boolean => {
//   if (CurrentPermissionsModule.is_superuser) return true
//   let cap = CurrentPermissionsModule.current_auth_permissions
//   if (cap && cap.length > 0) {
//     let up = cap.find(up => up === permCodeName)
//     return Boolean(up)
//   }
//   return false
// }

