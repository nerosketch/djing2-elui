<template lang="pug">
el-card(
  shadow="hover"
  :body-style="defCardStyle"
)
  template(v-slot:header)
    .clearfix
      span {{ comment.author_name }}
      small {{ comment.date_create }}
      el-button.card_del_btn(
        type="text" icon='el-icon-close'
        v-if="comment.can_remove"
        @click="delComment"
      )
  el-avatar(shape="square" :src='comment.author_avatar')
  span &nbsp; {{ comment.text }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { IComment } from './types'

@Component({
  name: 'CommentItem'
})
export default class extends Vue {
  @Prop({ required: true })
  private comment!: IComment

  get defCardStyle() {
    return { padding: '10px 13px' }
  }

  private delComment() {
    this.$confirm('Удалить комментарий?', {
      confirmButtonText: 'да',
      cancelButtonText: 'нет'
    }).then(() => {
      this.$emit('delete', this.comment.id)
    })
  }
}
</script>
