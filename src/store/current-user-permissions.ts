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
    view_customer: false,

    add_customerstreet: true,
    change_customerstreet: false,
    delete_customerstreet: false,
    view_customerstreet: false,

    can_buy_service: false,
    can_add_balance: false,
    can_ping: false,
    can_stop_service: false,

    add_additionaltelephone: false,
    delete_additionaltelephone: false,
    view_additionaltelephone: false,
    change_additionaltelephone: false,

    add_customerlog: false,
    change_customerlog: false,
    view_customerlog: false,
    delete_customerlog: false,

    view_customerservice: false,
    change_customerservice: false,
    add_customerservice: false,
    delete_customerservice: false,

    add_passportinfo: false,
    view_passportinfo: false,
    change_passportinfo: false,
    delete_passportinfo: false,
    
  }

  public networks = {
    view_customeripleasemodel: false,
    add_customeripleasemodel: false,
    change_customeripleasemodel: false,
    delete_customeripleasemodel: false,

    view_vlanif: false,
    add_vlanif: false,
    change_vlanif: false,
    delete_vlanif: false
  }

  public tasks = {
    delete_task: false,
    change_task: false,
    add_task: false,
    view_task: false,

    // can_viewall: false,
    can_remind: false,

    add_extracomment: false,
    view_extracomment: false,
    change_extracomment: false,
    delete_extracomment: false,

    add_changelog: false,
    view_changelog: false,
    change_changelog: false,
    delete_changelog: false,

    add_taskdocumentattachment: false,
    view_taskdocumentattachment: false,
    change_taskdocumentattachment: false,
    delete_taskdocumentattachment: false,

  }

  public devices = {
    view_device: false,
    change_device: false,
    add_device: false,
    delete_device: false,
    
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
