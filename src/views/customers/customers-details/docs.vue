<template lang="pug">
  el-upload(
    action=""
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :http-request="uploadReq"
    :file-list="fileList"
    :disabled="!$perms.customers.view_customerattachment")
    el-button(type="primary")
      | {{ $t('addDocument') }}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { HttpRequestOptions } from 'element-ui/types/upload'
import { CustomerAttachementModule } from '@/store/modules/customers/customer-attachments'
import { getAttachments } from '@/api/customers/req'
import { ICustomerAttachement } from '@/api/customers/types'
import { CustomerModule } from '@/store/modules/customers/customer'

interface IFileItem {
  id: number
  name: string
  url: string
}

@Component({
  name: 'CustomerDocs'
})
export default class extends Vue {
  // @Prop({ default: null }) private customerId!: number | null
  private fileList: IFileItem[] = []

  private handleRemove(file: IFileItem) {
    CustomerAttachementModule.DelCustomerAttachment(file.id)
  }

  private handlePreview(file: IFileItem) {
    window.open(file.url, '_blank')
  }

  private beforeRemove(file: IFileItem) {
    return this.$confirm(`${this.$tc('del')} "${file.name}"?`)
  }

  private customerId() {
    return CustomerModule.id
  }

  private uploadReq(req: HttpRequestOptions) {
    CustomerAttachementModule.AddCustomerAttachment({
      title: req.file.name,
      doc_file: req.file,
      customer: this.customerId()
    }).then(newAtt => {
      this.addFileListItem(newAtt)
    })
  }

  private addFileListItem(it: ICustomerAttachement) {
    this.fileList.push({
      id: it.id,
      name: `${it.title} (${it.create_time})`,
      url: it.doc_file
    })
  }

  private async loadFileList() {
    if (this.customerId() && this.customerId() > 0) {
      try {
        const { data } = await getAttachments(this.customerId())
        for (const el of data) {
          this.addFileListItem(el)
        }
      } catch {
        this.$message.error(
          this.$tc('customers.docLoadFailed')
        )
      }
    } else {
      this.$message.error(
        this.$tc('customers.customerIdNotPassed')
      )
    }
  }

  created() {
    this.loadFileList()
  }
}
</script>
