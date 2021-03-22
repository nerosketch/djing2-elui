<template lang="pug">
  el-card(shadow="never" :loading="loading")
    template(v-slot:header)
      .clearfix
        b Комментарии задачи
    div
      el-card(
        shadow="hover"
        :body-style="defCardStyle"
        v-for="c in comments"
        :key="c.id"
      )
        template(v-slot:header)
          .clearfix
            span {{ c.author_name }} 
            small {{ c.date_create }}
            el-button.comment_btn(
              type="text" icon='el-icon-close'
              v-if="c.can_remove"
              @click="delComment(c)"
              :disabled="!$perms.tasks.delete_extracomment"
            )
        el-avatar(shape="square" size='medium' :src='c.author_avatar')
        span &nbsp; {{ c.text }}
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
import { IExtraComment } from '@/api/tasks/types'
import { getComments, addComment, delComment } from '@/api/tasks/req'
import { TaskModule } from '@/store/modules/tasks/tasks'

@Component({
  name: 'Comments'
})
export default class extends Vue {
  get defCardStyle() {
    return { padding: '10px 13px' }
  }
  private loading = false
  private currentComment = ''
  private comments: IExtraComment[] = []

  private async loadComments() {
    this.loading = true
    try {
      const { data } = await getComments(TaskModule.id)
      this.comments = data
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
    await addComment(this.currentComment, TaskModule.id)
    this.currentComment = ''
    await this.loadComments()
    this.loading = false
  }

  private delComment(c: IExtraComment) {
    this.$confirm('Удалить комментарий?', {
      confirmButtonText: 'да',
      cancelButtonText: 'нет'
    }).then(async() => {
      await delComment(c.id)
      this.loadComments()
      this.$message.success('Комментарий удалён')
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
