<template lang="pug">
el-form
  el-form-item(
    v-for="(opt, i) in channelOpts"
    :key="i"
  )
    el-switch(
      v-model="opt.value"
      :active-text="opt.label"
    )

</template>

<script lang="ts">
import { IOpt } from '@/api/messenger/types'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'MsgOptionChannels'
})
export default class extends Vue {
  @Prop({ default: () => ([]) }) private channelOpts!: IOpt[]
}
</script>
