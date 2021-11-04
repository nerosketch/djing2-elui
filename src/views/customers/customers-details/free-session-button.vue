<template lang="pug">
el-button(
  icon='el-icon-toilet-paper'
  :loading='loading'
  @click="freeSessionAction"
) {{ $t('customers.freeSession') }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { sessionRequestFree } from '@/api/sessions/req'

@Component({
  name: 'FreeSessionButton'
})
export default class extends Vue {
  @Prop({ required: true })
  private sessionId!: number

  private loading = false

  private async freeSessionAction() {
    this.loading = true
    try {
      const { data } = await sessionRequestFree(this.sessionId)
      if (data) {
        this.$message.success(data)
      } else {
        this.$message.error('failed')
      }
      this.$emit('done', data)
    } finally {
      this.loading = false
    }
  }
}

</script>
