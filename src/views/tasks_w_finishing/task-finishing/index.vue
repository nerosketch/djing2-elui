<template lang="pug">
  el-form(
    ref='form'
    status-icon
    :rules="frmRules"
    :model="frmMod"
    v-loading="loading"
  )
    el-form-item(
      label="Актуальность"
      prop='out_date'
    )
      el-tooltip(
        content="дата, до которой нужно завершить задачу"
        placement="right"
      )
        el-date-picker(
          v-model="frmMod.out_date"
          type="date"
          value-format="yyyy-MM-dd"
          format="d.MM.yyyy"
        )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'TaskFinishing'
})
export default class extends Vue {
  private loading = false

  private frmRules = {}

  private frmMod = {
    out_date: '',
  }
}
</script>
