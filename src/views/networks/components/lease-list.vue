<template lang="pug">
  datatable(
    :columns="tableColumns"
    :getData="loadSessions"
    :heightDiff="160"
    widthStorageNamePrefix="sessions"
    ref="table")
    template(v-slot:is_dynamic="{row}")
      boolean-icon(v-model="row.is_dynamic")

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { IDRFRequestListParameters } from '@/api/types'
import { ICustomerIpLease } from '@/api/networks/types'
import { getCustomerIpLeases } from '@/api/networks/req'
import BooleanIcon from '@/components/boolean-icon.vue'

class DataTableComp extends DataTable<ICustomerIpLease> {}

@Component({
  name: 'LeaseList',
  components: {
    datatable: DataTableComp,
    BooleanIcon
  }
})
export default class extends Vue {
  @Prop({ default: null }) private uid!: number | null

  public readonly $refs!: {
    table: DataTableComp
  }

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'lease_time',
      label: this.$tc('startTime'),
      'min-width': 130
    },
    {
      prop: 'ip_address',
      label: 'ip',
      'min-width': 200
    },
    {
      prop: 'mac_address',
      label: this.$tc('macAddress'),
      sortable: true,
      'min-width': 150
    },
    {
      prop: 'is_dynamic',
      label: this.$tc('networks.isDynamic'),
      align: DataTableColumnAlign.CENTER
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
      params.fields = 'id,lease_time,ip_address,mac_address,h_input_octets,h_output_octets,h_input_packets,h_output_packets'
    }
    if (this.uid === null) {
      return getCustomerIpLeases(params)
    }
    return getCustomerIpLeases(Object.assign(params, { customer: this.uid }))
  }
}
</script>
