<template lang="pug">
  datatable(
    :columns="tableColumns"
    :getData="loadSessions"
    :heightDiff="160"
    widthStorageNamePrefix="sessions"
    ref="table")
    template(v-slot:closed="{row}")
      el-checkbox(v-model="row.closed", disabled)
        | {{ row.closed ? 'Да' : 'Нет' }}

    template(v-slot:oper="{row}")
      el-button(icon="el-icon-delete-solid", @click="shutdownSesion(row)")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { IUserSession } from '@/api/sessions/types'
import { IDRFRequestListParameters } from '@/api/types'
import { delSession, getSessionList, getGuestSessionList } from '@/api/sessions/req'

class DataTableComp extends DataTable<IUserSession> {}

@Component({
  name: 'SessionList',
  components: { datatable: DataTableComp }
})
export default class extends Vue {
  @Prop({ default: null }) private uid!: number | null

  public readonly $refs!: {
    table: DataTableComp
  }

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'assign_time',
      label: this.$t('startTime'),
      'min-width': 130
    },
    {
      prop: 'session_duration',
      label: this.$t('durationOfTheSession'),
      'min-width': 200
    },
    {
      prop: 'ip_lease_ip',
      label: 'ip',
      'min-width': 200
    },
    {
      prop: 'ip_lease_mac',
      label: this.$t('maqueres'),
      sortable: true,
      'min-width': 150
    },
    {
      prop: 'closed',
      label: this.$t('closed')
    },
    {
      prop: 'h_input_octets',
      label: this.$t('incomingByte')
    },
    {
      prop: 'h_output_octets',
      label: this.$t('basedOnByte')
    },
    {
      prop: 'h_input_packets',
      label: this.$t('incomingPackages')
    },
    {
      prop: 'h_output_packets',
      label: this.$t('packages')
    },
    {
      prop: 'op',
      label: this.$t('op'),
      'min-width': 130,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private loadSessions(params?: IDRFRequestListParameters) {
    if (params) {
      params.fields = 'id,assign_time,session_duration,ip_lease_ip,ip_lease_mac,closed,h_input_octets,h_output_octets,h_input_packets,h_output_packets'
    }
    if (this.uid === null) {
      return getGuestSessionList(params)
    }
    return getSessionList(Object.assign(params, { customer: this.uid }))
  }

  private shutdownSesion(ses: IUserSession) {
    this.$confirm(this.$t('areYSureFinishSession')).then(async() => {
      await delSession(ses.id)
      this.$refs.table.LoadTableData()
    }).catch(err => {
      this.$message.error(err)
    })
  }
}
</script>
