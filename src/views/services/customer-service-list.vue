<template lang="pug">
  el-table(
    v-loading='loading'
    :data="customeServiceList"
    border fit
  )
    el-table-column(
      label="Логин"
      prop='username'
    )
    el-table-column(
      label="Имя"
      prop='fio'
    )
      template(v-slot:default="{row}")
        router-link(:to="{name: 'customerDetails', params:{uid: row.id }}")
          el-link(type="primary") {{ row.fio }}
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { getServiceUsers } from '@/api/customers/req'
import { IServiceUser } from '@/api/customers/types'

@Component({
  name: 'CustomerServiceList'
})
export default class extends Vue {
  @Prop({ required: true }) private serviceId!: number
  private loading = false
  private customeServiceList?: IServiceUser[]

  mounted() {
    this.loadSrvUsers(this.serviceId)
  }

  @Watch('serviceId')
  private onChServiceId(serviceId: number) {
    this.loadSrvUsers(serviceId)
  }

  private async loadSrvUsers(srvId: number) {
    this.loading = true
    try {
      const { data } = await getServiceUsers(srvId)
      this.customeServiceList = data
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.loading = false
    }
  }
}
</script>
