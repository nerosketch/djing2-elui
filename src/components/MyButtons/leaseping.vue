<template lang="pug">
  el-button(
    :icon='defIcon'
    @click="pingIcmp(row)"
    :type="defType"
    :loading="loading"
  ) {{ btnText }}
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { ICustomerIpLease } from '@/api/networks/types'
import { CustomerIpLeaseModule } from '@/store/modules/networks/ip_lease'

@Component({
  name: 'LeasePing'
})
export default class extends Vue {
  @Prop({ default: null }) private lease!: ICustomerIpLease
  private btnText = 'Ping'
  private defType = ''
  private defIcon = 'el-icon-mouse'
  private loading = false

  private async pingIcmp() {
    if (this.lease) {
      this.loading = true
      try {
        const pingRes = await CustomerIpLeaseModule.PingIcmp(this.lease.id)
        this.btnText = pingRes.text
        if (pingRes.status) {
          this.defType = 'success'
          this.defIcon = 'el-icon-success'
        } else {
          this.defType = 'danger'
          this.defIcon = 'el-icon-error'
        }
      } catch (err) {
        this.$message.error(err)
      }
      let tv = setTimeout(() => {
        this.btnText = 'Ping'
        this.defType = ''
        this.defIcon = 'el-icon-mouse'
        clearTimeout(tv)
      }, 10000)
      this.loading = false
    } else {
      this.$message.warning('Не передана аренда ip')
    }
  }
}
</script>
