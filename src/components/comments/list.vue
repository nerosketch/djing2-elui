<template lang="pug">
el-card(shadow="never" :loading="loading")
  template(v-slot:header)
    .clearfix {{ defaultCardTitle }}
  div
    template(v-for="c in comments")
      slot(name="comment_item" v-bind:comment="c")
        comment-item.mt5(
          :key="c.id"
          :comment="c"
          @delete="onCommentDelete"
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
import { IComment } from './types'
import { Component, Vue, Prop } from 'vue-property-decorator'
import CommentItem from './comment-item.vue'

@Component({
  name: 'CommentList',
  components: {
    CommentItem
  }
})
export default class extends Vue {
  @Prop({ default: () => ([] )})
  private comments: IComment[] = []
  
  @Prop({ default: 'Комментарии' })
  private defaultCardTitle!: string

  private loading = false
  private sendLoading = false
  private currentComment = ''

  private async onSendComment() {
    this.sendLoading = true
    try {
      this.$emit('send', this.currentComment)
      this.currentComment = ''
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.sendLoading = false
    }
  }

  private onCommentDelete(commentId: number) {
    this.$emit('delete', commentId)
  }
}
</script>
