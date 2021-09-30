<template lang="pug">
  el-form(
    inline
    status-icon
    :rules='frmRules'
    :model='frmMod'
    v-loading='isLoading'
  )
    el-form-item(
      label="Временный level"
    )
      el-input(type="number" v-model="tmpLevelNum")
    el-form-item(
      v-for="level in fiasLevels"
      :label="level.name"
    )
      var-level-addr-choice(
        :level="tmpLevelNum"
        v-model="frmMod.asd"
      )

</template>

<script lang="ts">
import { getAddrLevels } from '@/api/addresses/req'
import { IAddrLevelItem } from '@/api/addresses/types'
import { Component, Vue } from 'vue-property-decorator'
import VarLevelAddrChoice from './var-level-addr-choice.vue'

@Component({
  name: 'AddrSelectForm',
  components: {
    VarLevelAddrChoice
  }
})
export default class extends Vue {
  private isLoading = false

  private tmpLevelNum = 0

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
