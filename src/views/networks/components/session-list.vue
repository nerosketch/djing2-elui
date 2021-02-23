<template lang="pug">
  datatable(
    :columns="tableColumns"
    :getData="loadSessions"
    :heightDiff='160'
    widthStorageNamePrefix='sessions'
    ref='table'
  )
    template(v-slot:closed="{row}")
      el-checkbox(v-model="row.closed" disabled) {{ row.closed ? 'Да' : 'Нет' }}

    template(v-slot:oper="{row}")
      el-button(
        icon="el-icon-delete-solid" size="mini"
        @click="shutdownSesion(row)"
      )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { IUserSession } from '@/api/sessions/types'
import { IDRFRequestListParameters } from '@/api/types'
import { finishGuestSession, getSessionList } from '@/api/sessions/req'

class DataTableComp extends DataTable<IUserSession> {}

@Component({
  name: 'SessionList',
  components: { 'datatable': DataTableComp }
})
export default class extends Vue {
  public readonly $refs!: {
    table: DataTableComp
  }
  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'assign_time',
      label: 'Время старта',
      'min-width': 130
    },
    {
      prop: 'session_duration',
      label: 'Продолжительность сессии',
      'min-width': 200
    },
    {
      prop: 'ip_lease_ip',
      label: 'ip',
      'min-width': 200
    },
    {
      prop: 'ip_lease_mac',
      label: 'MAC Адрес',
      sortable: true,
      'min-width': 150
    },
    {
      prop: 'closed',
      label: 'Закрыт'
    },
    {
      prop: 'h_input_octets',
      label: 'Входящих байт'
    },
    {
      prop: 'h_output_octets',
      label: 'Исходящих байт'
    },
    {
      prop: 'h_input_packets',
      label: 'Входящих пакетов'
    },
    {
      prop: 'h_output_packets',
      label: 'Исходящих пакетов'
    },
    {
      prop: 'is_guest_session',
      label: 'Гостевая'
    },
    {
      prop: 'oper',
      label: 'Oper',
      'min-width': 130,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private loadSessions(params?: IDRFRequestListParameters) {
    if (params) {
      params['fields'] = 'id,assign_time,session_duration,ip_lease_ip,ip_lease_mac,closed,h_input_octets,h_output_octets,h_input_packets,h_output_packets,is_guest_session'
    }
    return getSessionList(params)
  }

  private shutdownSesion(ses: IUserSession) {
    this.$confirm('Завершить сессию?').then(async() => {
      await finishGuestSession(ses.id)
      this.$refs.table.GetTableData()
    }).catch(err => {
      this.$message.error(err)
    })
  }
}
</script>
