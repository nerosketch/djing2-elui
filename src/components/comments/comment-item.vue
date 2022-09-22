<template lang="pug">
  el-card(shadow="hover" :body-style="{ padding: '6px 5px', display: 'flex', 'flex-direction': 'row' }")
    template(#header)
      span {{ comment.author_name }}

      small  {{ comment.date_create }}

      el-button.card_del_btn(
        type="text"
        icon="el-icon-close"
        v-if="comment.can_remove"
        @click="delComment")

    el-avatar.ava(shape="square" :src="comment.author_avatar")

    pre.content {{ comment.text }}
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

<style scoped>
.ava {
  margin-right: 9px;
}
pre.content {
  margin: 0;
  white-space: pre-wrap;
  flex-basis: fit-content;
  align-items: flex-start;
}
</style>
