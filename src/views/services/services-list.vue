<template>
  <div>
    <datatable :columns="tableColumns" :getData="loadServices" :heightDiff="189" :editFieldsVisible.sync="editFieldsVisible" widthStorageNamePrefix="services" ref="table">
      <template v-slot:isadm="{row}">
        <el-checkbox v-model="row.is_admin" disabled>{{ row.is_admin ? 'Да' : 'Нет'}}</el-checkbox>
      </template>
      <template v-slot:oper="{row}">
        <el-button-group>
          <el-button v-if="$perms.is_superuser" @click="openSitesDlg(row)">C</el-button>
          <el-button icon="el-icon-lock" @click="openPermsDialog(row)" v-if="$perms.is_superuser"></el-button>
          <el-button icon="el-icon-edit" @click="openEdit(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" @click="delSrv(row)" :disabled="!$perms.services.delete_service"></el-button>
        </el-button-group>
      </template>
      <template v-slot:usercount="{row}">
        <el-button @click="openCustomerServiceListDialog(row.id)">{{ row.usercount }}</el-button>
      </template>
      <el-button-group>
        <el-button icon="el-icon-plus" type="success" @click="openNew" :disabled="!$perms.services.add_service">{{ $t('add') }}</el-button>
        <el-button icon="el-icon-s-operation" @click="editFieldsVisible=true">{{ $t('polya-2') }}</el-button>
      </el-button-group>
    </datatable>
    <el-dialog :title="$t('isnew-sozdanie-izmenenie-uslugi', [(isNew ? `Создание` : `Изменение`)])" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <service-form v-on:done="frmDone"></service-form>
    </el-dialog>
    <el-dialog title="$t('kto-imeet-prava-na-uslugu')" :visible.sync="permsDialog" top="5vh" :close-on-click-modal="false">
      <object-perms v-on:save="changeSrvObjectPerms" :getGroupObjectPermsFunc="getSrvObjectPermsFunc4Grp" :getSelectedObjectPerms="serviceGetSelectedObjectPerms" :objId="srvIdGetter"></object-perms>
    </el-dialog>
    <el-dialog title="$t('prinadlezhnost-saitam-5')" :visible.sync="sitesDlg" :close-on-click-modal="false">
      <sites-attach :selectedSiteIds="$store.state.service.sites" v-on:save="serviceSitesSave"></sites-attach>
    </el-dialog>
    <el-dialog title="$t('polzovateli-uslugi')" :visible.sync="customerServiceVisible" top="2vh" :close-on-click-modal="false">
      <customer-service-list :serviceId="currentCustomerServiceId"></customer-service-list>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IObjectGroupPermsResultStruct, IObjectGroupPermsInitialAxiosResponsePromise } from '@/api/types'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { IService, IDRFRequestListParametersService } from '@/api/services/types'
import { getServices, setServiceObjectsPerms, getServiceObjectsPerms, getServiceOSelectedObjectPerms } from '@/api/services/req'
import { ServiceModule } from '@/store/modules/services/service'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import ServiceForm from './service-form.vue'
import CustomerServiceList from './customer-service-list.vue'

class DataTableComp extends DataTable<IService> {}

@Component({
  name: 'ServiceList',
  components: {
    datatable: DataTableComp,
    ServiceForm,
    CustomerServiceList
  }
})
export default class extends Vue {
  public readonly $refs!: {
    table: DataTableComp
  }

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'title',
      label: this.$t('nazvanie-7'),
      sortable: true,
      'min-width': 200
    },
    {
      prop: 'descr',
      label: this.$t('opisanie-11'),
      'min-width': 300
    },
    {
      prop: 'speed_in',
      label: this.$t('vkhod-sk'),
      'min-width': 110,
      sortable: true
    },
    {
      prop: 'speed_out',
      label: this.$t('iskhod-sk'),
      'min-width': 110,
      sortable: true
    },
    {
      prop: 'speed_burst',
      label: this.$t('burst'),
      'min-width': 100
    },
    {
      prop: 'cost',
      label: this.$t('cena'),
      'min-width': 90,
      sortable: true
    },
    {
      prop: 'isadm',
      label: this.$t('admin'),
      'min-width': 80,
      align: DataTableColumnAlign.CENTER
    },
    {
      prop: 'usercount',
      label: this.$t('kol-polz'),
      'min-width': 130,
      sortable: true,
      align: DataTableColumnAlign.CENTER
    },
    {
      prop: 'oper',
      label: this.$t('knopki-6'),
      'min-width': 180,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private services: IService[] = []
  private dialogVisible = false
  private permsDialog = false
  private sitesDlg = false
  private editFieldsVisible = false
  private customerServiceVisible = false
  private currentCustomerServiceId = 0

  private async openEdit(srv: IService) {
    await ServiceModule.SET_ALL_SERVICE(srv)
    this.dialogVisible = true
  }

  private openNew() {
    ServiceModule.RESET_ALL_SERVICE()
    this.dialogVisible = true
  }

  private async delSrv(srv: IService) {
    if (confirm({{ $t('deistvitelno-udalit-uslugu-srv-title', [srv.title]) }})) {
      await ServiceModule.DelService(srv.id)
      this.$message.success(this.$t('usluga-udalena'))
      this.$refs.table.LoadTableData()
    }
  }

  private loadServices(params?: IDRFRequestListParametersService) {
    if (params) {
      params.fields = 'id,title,descr,speed_in,speed_out,speed_burst,cost,is_admin,usercount,calc_type,sites'
    }
    return getServices(params)
  }

  private frmDone() {
    this.dialogVisible = false
    this.$refs.table.LoadTableData()
  }

  get isNew(): boolean {
    return this.srvIdGetter === 0
  }

  get srvIdGetter() {
    return ServiceModule.id
  }

  private openPermsDialog(s: IService) {
    ServiceModule.SET_ALL_SERVICE(s)
    this.permsDialog = true
  }

  private async changeSrvObjectPerms(info: IObjectGroupPermsResultStruct) {
    await setServiceObjectsPerms(this.srvIdGetter, info)
    this.permsDialog = false
  }

  private getSrvObjectPermsFunc4Grp(): IObjectGroupPermsInitialAxiosResponsePromise {
    return getServiceObjectsPerms(this.srvIdGetter)
  }

  private serviceGetSelectedObjectPerms(srvId: number, profileGroupId: number) {
    return getServiceOSelectedObjectPerms(srvId, profileGroupId)
  }

  private openCustomerServiceListDialog(serviceId: number) {
    this.currentCustomerServiceId = serviceId
    this.customerServiceVisible = true
  }

  // Breadcrumbs
  created() {
    BreadcrumbsModule.SetCrumbs([
      {
        path: '/',
        meta: {
          hidden: true,
          title: this.$t('tarify-0')
        }
      }
    ] as any)
  }
  // End Breadcrumbs

  private serviceSitesSave(selectedSiteIds: number[]) {
    ServiceModule.PatchService({
      sites: selectedSiteIds
    }).then(() => {
      this.$refs.table.LoadTableData()
      this.$message.success(this.$t('prinadlezhnost-uslugi-saitam-sokhranena-0'))
    })
    this.sitesDlg = false
  }

  private openSitesDlg(srv: IService) {
    ServiceModule.SET_ALL_SERVICE(srv)
    this.sitesDlg = true
  }
}
</script>
