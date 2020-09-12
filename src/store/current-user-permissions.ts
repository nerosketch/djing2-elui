import { Module, getModule, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import store from '@/store'
import { getCurrentAuthPermissions } from '@/api/profiles/req'

interface ValueObserverItemPerm {
  [id: string]: boolean | undefined;
}

interface ValueObserverItem {
  [id: string]: ValueObserverItemPerm | undefined;
}

interface ValueObserver {
  value: ValueObserverItem
}

@Module({ dynamic: true, store, name: 'perms' })
export class CurrentPermissions extends VuexModule {
  public is_superuser = false
  public __ob__?: ValueObserver

  public customers = {
    add_customer: false,
    change_customer: false,
    delete_customer: false,
    view_customer: false,

    add_customerstreet: false,
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

    add_customerattachment: false,
    view_customerattachment: false,
    change_customerattachment: false,
    delete_customerattachment: false
  }

  public networks = {
    view_customeripleasemodel: false,
    add_customeripleasemodel: false,
    change_customeripleasemodel: false,
    delete_customeripleasemodel: false,

    view_vlanif: false,
    add_vlanif: false,
    change_vlanif: false,
    delete_vlanif: false,

    view_networkippool: false,
    add_networkippool: false,
    change_networkippool: false,
    delete_networkippool: false
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
    delete_taskdocumentattachment: false
  }

  public devices = {
    view_device: false,
    change_device: false,
    add_device: false,
    delete_device: false,

    can_remove_from_olt: false,
    can_fix_onu: false,
    can_apply_onu_config: false,
    can_toggle_ports: false,

    add_port: false,
    view_port: false,
    change_port: false,
    delete_port: false,

    add_portvlanmembermodel: false,
    view_portvlanmembermodel: false,
    change_portvlanmembermodel: false,
    delete_portvlanmembermodel: false
  }

  public fin_app = {
    add_payalltimegateway: false,
    view_payalltimegateway: false,
    change_payalltimegateway: false,
    delete_payalltimegateway: false
  }

  public gateways = {
    add_gateway: false,
    view_gateway: false,
    change_gateway: false,
    delete_gateway: false
  }

  public groupapp = {
    add_group: false,
    view_group: false,
    change_group: false,
    delete_group: false
  }

  public services = {
    add_service: false,
    view_service: false,
    change_service: false,
    delete_service: false,

    add_oneshotpay: false,
    view_oneshotpay: false,
    change_oneshotpay: false,
    delete_oneshotpay: false,

    add_periodicpay: false,
    view_periodicpay: false,
    change_periodicpay: false,
    delete_periodicpay: false
  }

  @Mutation
  public SET_IS_SUPERUSER(isu: boolean) {
    this.is_superuser = isu
  }

  @Mutation
  public SET_CURRENT_PERM(perms: string[]) {
    if (!this.__ob__) return
    for (let s of perms) {
      let chunks = s.split('.')
      if (chunks.length === 2) {
        let k = chunks[0]
        let sect = this.__ob__.value[k]
        if (sect) {
          let v = chunks[1] as string | undefined
          if (v) {
            sect[v] = true
          }
        }
      }
    }
  }

  @Action
  public async GetCurrentAuthPermissions() {
    const { data } = await getCurrentAuthPermissions()
    this.SET_CURRENT_PERM(data)
  }
}

export const CurrentPermissionsModule = getModule(CurrentPermissions)
