<template lang="pug">
  el-select(v-model="localValue" :loading='loading')
    el-option(
      v-for="loc in localities"
      :key="loc.id"
      :label="loc.title"
      :value="loc.id"
    )
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { ILocalityModel } from '@/api/addresses/types'
import { getLocalities } from '@/api/addresses/req'

@Component({
  name: 'LocalityChoice'
})
export default class extends Vue {
  private localities: ILocalityModel[] = []
  @Prop({ required: true })
  private value!: number

  private localValue = this.value
  private loading = false

  private async loadLocalities() {
    this.loading = true
    try {
      const { data } = await getLocalities({
        fields: 'id,title',
        page: 1,
        page_size: 0
      }) as any
      this.localities = data
    } finally {
      this.loading = false
    }
  }

  created() {
    this.loadLocalities()
  }

  @Watch('localValue')
  private onChLocVal(val: number) {
    this.$emit('input', val)
  }
}
</script>
