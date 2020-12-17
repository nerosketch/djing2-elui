<template lang="pug">
  el-table(
    :data="vlans"
    v-loading="loading"
    empty-text="Vlan'ы на порту не найдены"
    border fit size='small'
  )
    el-table-column(
      label="Название"
      min-width='200'
      prop='title'
    )
    el-table-column(
      label="VID"
      min-width='64'
      prop='vid'
    )
    el-table-column(
      label="native"
    )
      template(v-slot:default="{row}")
        | {{ row.native ? 'Да' : 'Нет' }}
    el-table-column(
      label="Управление"
    )
      template(v-slot:default="{row}")
        //- input(:checked="row.is_management" disabled type="checkbox")
        | {{ row.is_management ? 'Да' : 'Нет' }}

</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
// import { Form } from 'element-ui'
import { PortModule } from '@/store/modules/devices/port'
import { IDevVlan } from '@/api/devices/types'

@Component({
  name: 'VidsView'
})
export default class extends Vue {
  @Prop({ default: 0 }) portId!: number
  private loading = false
  private vlans: IDevVlan[] = []

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
        this.vlans = await PortModule.ScanPortVlans(this.portId)
      } catch (err) {
        this.$message.error(err)
      } finally {
        this.loading = false
      }
    } else {
      this.$message.error('portId parameter is required')
    }
  }
}
</script>
