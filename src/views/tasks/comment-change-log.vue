<template>  
  <el-alert offset="2" show-icon :closable="false"><b>{{ log.who_name }}:</b><small>({{ log.when }})</small>{{ log.human_representation }}.</el-alert>
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
