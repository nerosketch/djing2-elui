<template lang="pug">
  comment-list(:comments="comments" @send="onSendComment")
    template(#comment_item="{ comment }")
      comment-item.mt5(
        v-if="comment.type === 'comment'"
        :key="comment.id"
        :comment="comment"
        @delete="delComment")

      comment-change-log.mt5(
        v-else
        :log="comment"
      )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IExtraCommentCombinedWithTaskStateChangeLog } from '@/api/tasks/types'
import { getCommentsWithLogs, addComment, delComment } from '@/api/tasks/req'
import CommentChangeLog from './comment-change-log.vue'
import CommentItem from '@/components/comments/comment-item.vue'
import CommentList from '@/components/comments/list.vue'

@Component({
  name: 'Comments',
  components: {
    CommentItem,
    CommentChangeLog,
    CommentList
  }
})
export default class extends Vue {
  private comments: IExtraCommentCombinedWithTaskStateChangeLog[] = []

  public async loadComments() {
    const { data } = await getCommentsWithLogs(this.$store.state.task.id)
    this.comments = data
  }

  created() {
    this.loadComments()
  }

  private async onSendComment(commentText: string) {
    await addComment(commentText, this.$store.state.task.id)
    this.loadComments()
  }

  private async delComment(commentId: number) {
    await delComment(commentId)
    this.$message.success(this.$tc('commentDeleted'))
    this.loadComments()
  }
}
</script>
