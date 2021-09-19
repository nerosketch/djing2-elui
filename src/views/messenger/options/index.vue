<template lang="pug">
el-row(:gutter="5" v-loading="loading")
  el-col.mt5(:lg="12" :sm='24' v-if="opts")
    el-card(shadow="never")
      template(v-slot:header) Каналы оповещений
      msg-option-channels(
        :channelOpts="opts.notification_flags"
      )
  el-col.mt5(:lg="12" :sm='24' v-if="opts")
    el-card(shadow="never")
      template(v-slot:header) Настройки оповещений
      msg-option-opts(
        :variousOpts="opts.various_options"
      )
  el-col.mt5(:span='24')
    el-button(
      icon='el-ison-save'
      type='success'
      @click="saveOpts"
      :diabled="!opts"
    ) Сохранить
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getOptions } from '@/api/messenger/req'
import MsgOptionChannels from './channels.vue'
import MsgOptionOpts from './notify-ops.vue'
import { IMessengerOptions } from '@/api/messenger/types'
import { MessengerOptionsModule } from '@/store/modules/messenger/options'

@Component({
  name: 'MessengerOptions',
  components: {
    MsgOptionChannels,
    MsgOptionOpts,
  }
})
export default class extends Vue {
  private opts: IMessengerOptions | null = null
  private loading = false

  private async getOpts() {
    this.loading = true
    try {
      const { data } = await getOptions()
      this.opts = data
    } finally {
      this.loading = false
    }
  }

  private saveOpts() {
    if (this.opts) {
      MessengerOptionsModule.SetOptions(this.opts).then(() => {
        this.$message.success('Сохранено')
      })
    }
  }

  created() {
    this.getOpts()
  }
}
</script>
