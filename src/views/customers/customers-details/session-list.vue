<template lang="pug">
.app-container
  datatable(
    :columns="tableColumns"
    :getData="getSessions"
    :tableRowClassName="rowColor"
    :heightDiff="100"
    widthStorageNamePrefix='sessions'
    ref='tbl'
  )
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { IDRFRequestListParameters } from '@/api/types'
import DataTable, { IDataTableColumn } from '@/components/Datatable/index.vue'
import { IUserSession } from '@/api/sessions/types'
import { getSessionList } from '@/api/sessions/req'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import { RouteRecord } from 'vue-router'
import { CustomerModule } from '@/store/modules/customers/customer'

class DataTableComp extends DataTable<IUserSession> {}

interface IDRFSessionRequestListParameters extends IDRFRequestListParameters {
  customer: number
}

interface ITableRowClassName {
  row: IUserSession
  rowIndex: number
}

@Component({
  name: 'SessionList',
  components: {
    'datatable': DataTableComp
  }
})
export default class extends Vue {
  @Prop({ required: true }) private uid!: number
  @Prop({ default: null }) private gid?: number
  @Prop({ default: null }) private grpName?: string
  @Prop({ default: null }) private customerName?: string

  private mgid = 0
  private mgrpName = ''
  private mCusName = ''

  public readonly $refs!: {
    tbl: DataTableComp
  }

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'radius_username',
      label: 'MAC',
      'min-width': 150
    },
    {
      prop: 'framed_ip_addr',
      label: 'IP',
      'min-width': 150
    },
    {
      prop: 'assign_time',
      label: 'Время старта',
      'min-width': 150
    },
    {
      prop: 'session_duration',
      label: 'Продолжительность',
      'min-width': 160
    },
    {
      prop: 'last_event_time',
      label: 'Время последнего обновления',
      'min-width': 240
    },
    {
      prop: 'h_input_octets',
      label: 'Входящий трафик с момента старта',
      'min-width': 280
    },
    {
      prop: 'h_output_octets',
      label: 'Исходящий трафик с момента старта',
      'min-width': 280
    },
    {
      prop: 'h_input_packets',
      label: 'Входящие пакеты с момента старта',
      'min-width': 280
    },
    {
      prop: 'h_output_packets',
      label: 'Исходящие пакеты с момента старта',
      'min-width': 280
    }
  ]

  private getSessions(params?: IDRFSessionRequestListParameters) {
    if (params) {
      params.customer = this.uid
    }
    return getSessionList(params)
  }

  private rowColor({ row }: ITableRowClassName) {
    return row.closed ? 'expired-row' : ''
  }

  created() {
    this.setCrumbs()
    this.loadIfNotPassed()
  }

  mounted() {
    this.$refs.tbl.GetTableData()
  }

  private async loadIfNotPassed() {
    if (!this.gid || !this.customerName || !this.grpName) {
      const customer = await CustomerModule.GetCustomer(this.uid)
      this.mgid = customer.group
      this.mgrpName = customer.group_title!
      this.mCusName = customer.full_name!
    } else {
      this.mgid = this.gid!
      this.mgrpName = this.grpName!
      this.mCusName = this.customerName!
    }
    this.setCrumbs()
  }

  private setCrumbs() {
    BreadcrumbsModule.SetCrumbs([
      {
        path: '/customers/',
        meta: {
          hidden: true,
          title: 'Группы абонентов'
        }
      },
      {
        path: { name: 'customersList', params: { groupId: this.mgid } },
        meta: {
          hidden: true,
          title: this.mgrpName
        }
      },
      {
        path: { name: 'customerDetails', params: { uid: this.uid } },
        meta: {
          hidden: true,
          title: this.mCusName || '-'
        }
      },
      {
        path: '',
        meta: {
          hidden: true,
          title: 'Сессии авторизации'
        }
      }
    ] as RouteRecord[])
  }
}
</script>
