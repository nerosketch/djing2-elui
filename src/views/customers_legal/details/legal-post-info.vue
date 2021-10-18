<template lang="pug">
  el-form(
    ref='frm'
    status-icon
    :rules="frmRules"
    :model="frmMod"
    v-loading="loading"
  )
    el-form-item(
      label="Почтовый индекс"
    )
      el-input(
        v-model="frmMod.post_index"
      )
    el-form-item(
      label="Почтовый адрес"
    )
      addr-field-input(v-model="frmMod.address")
    el-form-item
      el-button(
        type='primary'
        icon='el-icon-upload'
        @click="onSubmit"
      ) Созраниь
</template>

<script lang="ts">
import { Form } from 'element-ui'
import { Component, Vue } from 'vue-property-decorator'
import AddrFieldInput from '@/components/Address/addr-field-input/index.vue'

@Component({
  name: 'LegalPostForm',
  components: {
    AddrFieldInput
  }
})
export default class extends Vue {
  public readonly $refs!: {
    frm: Form
  }

  private loading = false

  private frmMod = {
    post_index: '',
    address: null
  }

  private frmRules = {}

  private onSubmit() {
    this.$refs.frm.validate(async valid => {
      if (valid) {
        this.loading = true
        try {
          //const { data } = await
        } finally {
          this.loading = false
        }
      } else {
        this.$message.error('Исправь ошибки формы')
      }
    })
  }
}
</script>
