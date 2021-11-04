<template lang="pug">
  el-upload(
    action=""
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :http-request="uploadReq"
    :file-list="fileList"
  )
    el-button(
      type="primary"
      v-if="$perms.tasks.add_taskdocumentattachment"
    ) {{ $t('addDocument') }}
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { TaskAttachmentModule } from '@/store/modules/tasks/attachments'
import { HttpRequestOptions } from 'element-ui/types/upload'
import { getAttachments } from '@/api/tasks/req'
import { ITaskDocumentAttachment } from '@/api/tasks/types'
import { CurrentPermissions } from '@/store/current-user-permissions'

interface IFileItem {
  id: number
  name: string
  url: string
}

@Component({
  name: 'TaskDocs'
})
export default class extends Vue {
  private $perms!: CurrentPermissions
  @Prop({ default: 0 }) private taskId!: number

  private fileList: IFileItem[] = []

  private handleRemove(file: IFileItem) {
    if (!this.$perms.tasks.delete_taskdocumentattachment) return
    TaskAttachmentModule.DelAttachment(file.id)
  }

  private handlePreview(file: IFileItem) {
    window.open(file.url, '_blank')
  }

  private beforeRemove(file: IFileItem) {
    if (!this.$perms.tasks.delete_taskdocumentattachment) return false
    return this.$confirm(`Удалить "${file.name}"?`)
  }

  private uploadReq(req: HttpRequestOptions) {
    TaskAttachmentModule.AddAttachment({
      title: req.file.name,
      doc_file: req.file,
      task: this.taskId
    }).then(newAtt => {
      this.addFileListItem(newAtt)
    })
  }

  private addFileListItem(it: ITaskDocumentAttachment) {
    this.fileList.push({
      id: it.id,
      name: `${it.title} (${it.create_time})`,
      url: it.doc_file
    })
  }

  private async loadFileList() {
    const { data } = await getAttachments(this.taskId)
    for (const el of data) {
      this.addFileListItem(el)
    }
  }

  created() {
    this.loadFileList()
  }
}
</script>
