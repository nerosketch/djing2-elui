<template lang="pug">
  el-card(
    shadow="hover"
    :body-style="defCardStyle"
  )
    template(v-slot:header)
      .clearfix
        span {{ comment.author_name }} 
        small {{ comment.date_create }}
        el-button.comment_btn(
          type="text" icon='el-icon-close'
          v-if="comment.can_remove"
          @click="delComment"
          :disabled="!$perms.tasks.delete_extracomment"
        )
    el-avatar(shape="square" size='medium' :src='comment.author_avatar')
    span &nbsp; {{ comment.text }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { IExtraComment } from '@/api/tasks/types'
import { delComment } from '@/api/tasks/req'

@Component({
  name: 'CommentItem'
})
export default class extends Vue {
  @Prop({ required: true })
  private comment!: IExtraComment

  get defCardStyle() {
    return { padding: '10px 13px' }
  }

  private delComment() {
    this.$confirm('Удалить комментарий?', {
      confirmButtonText: 'да',
      cancelButtonText: 'нет'
    }).then(async() => {
      await delComment(this.comment.id)
      this.$message.success('Комментарий удалён')
      this.$emit('del')
    })
  }
}
</script>

<style>
.comment_btn {
  float: right;
  padding: 3px 0;
}
</style>
