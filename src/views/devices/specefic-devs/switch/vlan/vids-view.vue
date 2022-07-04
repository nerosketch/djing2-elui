<template lang="pug">
  div Порт №{{ portNum }}

    el-table(
      :data="deviceVlans"
      v-loading="loading"
      empty-text="Vlan'ы на порту не найдены"
      border
      fit)
      el-table-column(
        :label="$t('title')"
        min-width="200"
        prop="title")

      el-table-column(
        label="VID"
        min-width="64"
        prop="vid")

      el-table-column(label="native")
        template(v-slot:default="{row}")
          boolean-icon(v-model="row.native")

      el-table-column(:label="$t('office')")
        template(v-slot:default="{row}")
          boolean-icon(v-model="row.is_management")
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { PortModule } from '@/store/modules/devices/port'
import { IDevVlan } from '@/api/devices/types'
import BooleanIcon from '@/components/boolean-icon.vue'

@Component({
  name: 'VidsView',
  components: {
    BooleanIcon
  }
})
export default class extends Vue {
  @Prop({ default: 0 }) portId!: number
  @Prop({ default: 0 }) portNum!: number
  private loading = false
  private deviceVlans: IDevVlan[] = []

  @Watch('portId')
  private onChPoId() {
    this.loadVids()
  }

  created() {
    this.loadVids()
  }

  private async loadVids() {
    if (this.portId > 0) {
      this.loading = true
      try {
        this.deviceVlans = await PortModule.ScanPortVlans(this.portId)
      } finally {
        this.loading = false
      }
    } else {
      this.$message.error(this.$tc('parameterAndRiver'))
    }
  }
}
</script>
