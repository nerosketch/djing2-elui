<template lang="pug">
  el-form(
    inline
    status-icon
    :rules='frmRules'
    :model='frmMod'
    v-loading='isLoading'
  )
    el-form-item(
      v-for="level in fiasLevels"
      :label="level.name"
    )
      el-select(v-model="level.value")
        el-option(label="Opt1" value="1")
        el-option(label="Opt2" value="2")
        el-option(label="Opt3" value="3")
        el-option(label="Opt4" value="4")

</template>

<script lang="ts">
import { getAddrLevels } from '@/api/addresses/req'
import { IAddrLevelItem } from '@/api/addresses/types'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'AddrSelectForm'
})
export default class extends Vue {
  private isLoading = false

  private fiasLevels: IAddrLevelItem[] = []

  private async loadAddrLevels() {
    this.isLoading = true
    try {
      const { data } = await getAddrLevels()
      this.fiasLevels = data
    } finally {
      this.isLoading = false
    }
  }

  created() {
    this.loadAddrLevels()
  }

  private frmRules = {
    birth_day: [
      { required: true, message: 'Нужно указать дату рождения', trigger: 'blur' }
    ]
  }

  private frmMod = {
    asd: 0
  }
}
</script>
