<template lang="pug">
  el-alert(
    offset="2"
    show-icon
    :closable="false")
    b
      | {{ log.who_name }}:

    small
      | ({{ log.when }})
    | {{ log.human_representation }}.
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { IExtraCommentChangeLog } from '@/api/tasks/types'

@Component({
  name: 'CommentChangeLog'
})
export default class extends Vue {
  @Prop({ required: true })
  private log!: IExtraCommentChangeLog
}
</script>
