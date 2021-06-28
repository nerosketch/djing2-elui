<template lang="pug">
el-card(shadow="never" :loading="loading")
  template(v-slot:header)
    .clearfix
      b Комментарии
  div
    template(v-for="c in comments")
      comment-item.mt5(
        :key="c.id"
        :comment="c"
        @deleted="loadComments"
      )
  el-form
    el-form-item(
      label="Текст комментария"
      prop='currentComment'
    )
      el-input(v-model="currentComment" type="textarea" cols="40" rows="4")
    el-form-item
      el-button(
        type="primary" icon="el-icon-s-promotion" size='small'
        @click="onSendComment"
        :loading="sendLoading"
      ) Отправить
</template>

<script lang="ts">
import { createCustomerComment, getCustomerComments } from '@/api/customer_comments/req'
import { ICustomerComment } from '@/api/customer_comments/type'
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import CommentItem from './comment-item.vue'

@Component({
  name: 'CustomerCommentList',
  components: {
    CommentItem
  }
})
export default class extends Vue {
  @Prop({ required: true })
  private customerId!: number

  private loading = false
  private sendLoading = false
  private currentComment = ''
  private comments: ICustomerComment[] = []

  private async loadComments() {
    this.loading = true
    try {
      const { data } = await getCustomerComments(this.customerId)
      this.comments = data
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.loading = false
    }
  }

  @Watch('customerId')
  private onCustomerChanged() {
    this.loadComments()
  }

  private async onSendComment() {
    this.sendLoading = true
    try {
      await createCustomerComment({
        customer: this.customerId,
        text: this.currentComment
      })
      this.currentComment = ''
      this.loadComments()
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.sendLoading = false
    }
  }

  created() {
    this.loadComments()
  }
}
</script>
