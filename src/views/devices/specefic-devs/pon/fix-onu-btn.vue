<template lang="pug">
  el-button(
    :type="statusType"
    icon="el-icon-magic-stick"
    @click="tryToFixOnu"
    :loading="fixLoading"
    :disabled="!$perms.devices.can_fix_onu")
    | {{ buttonText }}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { DeviceModule } from '@/store/modules/devices/device'

@Component({
  name: 'FixOnuBtn'
})
export default class extends Vue {
  private fixLoading = false
  private buttonText = this.$t('ispravit')
  private buttonStatus = 0

  get statusType() {
    if (this.buttonStatus > 0) {
      return 'success'
    } else if (this.buttonStatus < 0) {
      return 'danger'
    }
    return 'default'
  }

  private async tryToFixOnu() {
    this.fixLoading = true
    try {
      const r = await DeviceModule.FixOnu()
      this.setBtnStatus(r.text, r.status)
      this.$emit('done')
    } finally {
      this.fixLoading = false
    }
  }

  private setBtnStatus(text: string, status: number) {
    this.buttonStatus = status === 1 ? 1 : -1
    this.buttonText = text
    let tm = setTimeout(() => {
      this.buttonText = this.$t('ispravit')
      this.buttonStatus = 0
      clearTimeout(tm)
    }, 15000)
  }
}
</script>
