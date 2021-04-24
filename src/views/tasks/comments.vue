<template lang="pug">
  el-card(shadow="never" :loading="loading")
    template(v-slot:header)
      .clearfix
        b Комментарии задачи
    div
      template(v-for="c in commentlogs")
        comment-item.mt5(
          v-if="c.type === 'comment'"
          :key="c.id"
          :comment="c"
          @del="loadComments"
        )
        comment-change-log.mt5(
          v-else
          :log="c"
        )
    el-form
      el-form-item(
        label="Текст комментария"
        prop='currentComment'
      )
        el-input(v-model="currentComment" type="textarea" cols="40" rows="10")
      el-form-item
        el-button(
          type="primary" icon="el-icon-s-promotion" size='small'
          @click="onSendComment"
          :disabled="!$perms.tasks.add_extracomment"
        ) Отправить
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IExtraCommentCombinedWithTaskStateChangeLog } from '@/api/tasks/types'
import { getCommentsWithLogs, addComment } from '@/api/tasks/req'
import CommentItem from './comment-item.vue'
import CommentChangeLog from './comment-change-log.vue'

@Component({
  name: 'Comments',
  components: {
    CommentItem,
    CommentChangeLog
  }
})
export default class extends Vue {
  private loading = false
  private currentComment = ''
  private commentlogs: IExtraCommentCombinedWithTaskStateChangeLog[] = []

  private async loadComments() {
    this.loading = true
    try {
      const { data } = await getCommentsWithLogs(this.$store.state.task.id)
      this.commentlogs = data
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.loading = false
    }
  }

  created() {
    this.loadComments()
  }

  private async onSendComment() {
    this.loading = true
    await addComment(this.currentComment, this.$store.state.task.id)
    this.currentComment = ''
    await this.loadComments()
    this.loading = false
  }
}
</script>
