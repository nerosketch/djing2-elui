<template lang="pug">
  datatable(
    :columns="tableColumns"
    :getData="loadSessions"
    :heightDiff="160"
    widthStorageNamePrefix="sessions"
    ref="table")
    template(v-slot:closed="{row}")
      el-checkbox(v-model="row.closed" disabled)
        | {{ row.closed ? 'Да' : 'Нет' }}

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { IDRFRequestListParameters } from '@/api/types'
import { ICustomerIpLease } from '@/api/networks/types'
import { getCustomerIpLeases } from '@/api/networks/req'

class DataTableComp extends DataTable<ICustomerIpLease> {}

@Component({
  name: 'LeaseList',
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
      label: this.$tc('startTime'),
      'min-width': 130
    },
    {
      prop: 'session_duration',
      label: this.$tc('durationOfTheSession'),
      'min-width': 200
    },
    {
      prop: 'ip_lease_ip',
      label: 'ip',
      'min-width': 200
    },
    {
      prop: 'ip_lease_mac',
      label: this.$tc('macAddress'),
      sortable: true,
      'min-width': 150
    },
    {
      prop: 'closed',
      label: this.$tc('closed')
    },
    {
      prop: 'h_input_octets',
      label: this.$tc('incomingByte')
    },
    {
      prop: 'h_output_octets',
      label: this.$tc('basedOnByte')
    },
    {
      prop: 'h_input_packets',
      label: this.$tc('incomingPackets')
    },
    {
      prop: 'h_output_packets',
      label: this.$tc('outgoingPackets')
    },
    {
      prop: 'oper',
      label: '#',
      'min-width': 130,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private loadSessions(params?: IDRFRequestListParameters) {
    if (params) {
      params.fields = 'id,assign_time,session_duration,ip_lease_ip,ip_lease_mac,closed,h_input_octets,h_output_octets,h_input_packets,h_output_packets'
    }
    if (this.uid === null) {
      return getCustomerIpLeases(params)
    }
    return getCustomerIpLeases(Object.assign(params, { customer: this.uid }))
  }
}
</script>
