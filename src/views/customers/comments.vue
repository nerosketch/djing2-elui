<template lang="pug">
  comment-list(
    :comments="comments"
    @send="onSendComment"
    @delete="delComment")
</template>

<script lang="ts">
import {
  createCustomerComment,
  getCustomerComments,
  deleteCustomerComment
} from '@/api/customer_comments/req'
import { ICustomerComment } from '@/api/customer_comments/type'
import { Component, Vue, Prop } from 'vue-property-decorator'

import CommentList from '@/components/comments/list.vue'

@Component({
  name: 'CustomerCommentList',
  components: {
    CommentList
  }
})
export default class extends Vue {
  @Prop({ required: true })
  private customerId!: number

  private comments: ICustomerComment[] = []

  private async loadComments() {
    const { data } = await getCustomerComments(this.customerId)
    this.comments = data
  }

  private async onSendComment(commentText: string) {
    await createCustomerComment({
      customer_id: this.customerId,
      text: commentText
    })
    this.loadComments()
  }

  private async delComment(commentId: number) {
    await deleteCustomerComment(commentId)
    this.$message.success(
      this.$tc('customers.commentRemoved')
    )
    this.loadComments()
  }

  created() {
    this.loadComments()
  }
}
</script>
