<template lang="pug">
el-card(
  shadow="hover"
  :body-style="defCardStyle"
)
  template(v-slot:header)
    .clearfix
      span {{ comment.author_name }} 
      small {{ comment.create_time }}
      el-button.comment_del_btn(
        type="text" icon='el-icon-close'
        v-if="comment.can_remove"
        @click="delComment"
      )
  el-avatar(shape="square" size='medium' :src='comment.author_avatar')
  span &nbsp; {{ comment.text }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { deleteCustomerComment } from '@/api/customer_comments/req'
import { ICustomerComment } from '@/api/customer_comments/type'

@Component({
  name: 'CommentItem'
})
export default class extends Vue {
  @Prop({ required: true })
  private comment!: ICustomerComment

  get defCardStyle() {
    return { padding: '10px 13px' }
  }

  private delComment() {
    this.$confirm('Удалить комментарий?', {
      confirmButtonText: 'да',
      cancelButtonText: 'нет'
    }).then(async() => {
      await deleteCustomerComment(this.comment.id)
      this.$message.success('Комментарий удалён')
      this.$emit('deleted')
    })
  }
}
</script>
