<template>  
  <el-upload action="" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" :http-request="uploadReq" :file-list="fileList">
    <el-button type="primary">{{ $t('contractDocs.addDoc') }}</el-button>
  </el-upload>
</template>

<script lang="ts">
import { HttpRequestOptions } from 'element-ui/types/upload'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { addContractDoc, delContractDoc, getContractDocs } from './api/reqs'
import { ICustomerContract, ICustomerContractAttachment } from './api/types'

interface IFileItem {
  id: number
  name: string
  url: string
}

@Component({
  name: 'ContractDocs'
})
export default class extends Vue {
  @Prop({ default: null })
  private contract!: ICustomerContract

  private fileList: IFileItem[] = []

  private handlePreview(file: IFileItem) {
    window.open(file.url, '_blank')
  }

  private async handleRemove(file: IFileItem) {
    try {
      await delContractDoc(file.id)
      this.$message.success(
        this.$t('contractDocs.docDeleted')
      )
    } catch {
      this.$message.error(
        this.$t('contractDocs.docDelFail')
      )
    }
  }

  private beforeRemove(file: IFileItem) {
    return this.$confirm(`${this.$t('del')} "${file.name}"?`)
  }

  private async uploadReq(req: HttpRequestOptions) {
    const { data } = await addContractDoc({
      title: req.file.name,
      doc_file: req.file,
      fields: 'id,title,create_time,doc_file',
      contract: this.contract.id
    })
    this.addFileListItem(data)
  }

  private addFileListItem(it: ICustomerContractAttachment) {
    this.fileList.push({
      id: it.id,
      name: `${it.title} (${it.create_time})`,
      url: it.doc_file
    })
  }

  private async loadFileList() {
    if (this.contract) {
      try {
        const { data } = await getContractDocs({
          page: 1,
          page_size: 999,
          contract: this.contract.id
        } as any)
        for (const el of data.results) {
          this.addFileListItem(el)
        }
      } catch {
        this.$message.error(
          this.$t('contractDocs.docLoadFail')
        )
      }
    } else {
      this.$message.error(
        this.$t('contractDocs.contractNotPassed')
      )
    }
  }

  created() {
    this.loadFileList()
  }
}
</script>
