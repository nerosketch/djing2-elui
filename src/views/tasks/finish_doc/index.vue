<template lang="pug">
  el-card(shadow='never')
    template(#header)
      .clearfix {{ $t('tasks.finishDoc.title') }}
    act-frm(
      :recipients="recipients"
    )
</template>

<script lang="ts">
import { IUserProfile } from '@/api/profiles/types'
import { TaskFinishDocumentModule } from '@/store/modules/tasks/finish_doc'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import ActFrm from './act_frm.vue'

@Component({
  name: 'FinishDocIndex',
  components: {
    ActFrm
  }
})
export default class extends Vue {
  @Prop({ default: [] })
  private recipients!: IUserProfile[]

  @Watch('$store.state.task.id')
  private onChTask(taskId: number) {
    this.loadFinDoc(taskId)
  }

  private loadFinDoc(taskId: number) {
    if (taskId > 0) {
      TaskFinishDocumentModule.GetFinishDoc(taskId)
    } else {
      TaskFinishDocumentModule.RESET_ALL_TASK_FINISH_DOC()
      TaskFinishDocumentModule.SET_TASK_FIN_DOC_TASK_ID(taskId)
    }
  }
}
</script>
