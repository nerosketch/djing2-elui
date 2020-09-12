<template lang="pug">
  div
    el-checkbox(
      v-for="srv in selected"
      :key="srv.pk"
      :label="srv.title"
      v-model="srv.state"
    )
    el-button(
      type='primary' size='mini'
      @click="saveAccessory"
    ) Сохранить
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IService } from '@/api/services/types'
import { CustomerModule } from '@/store/modules/customers/customer'
import { getServices } from '@/api/services/req'

interface SelectedState {
  pk: number
  state: boolean
  title: string
}

@Component({
  name: 'service-accessory'
})
export default class extends Vue {
  private services: IService[] = []
  private servicesLoading = false

  private selected: SelectedState[] = []

  private async loadServices() {
    this.servicesLoading = true
    try {
      const { data } = await getServices()
      this.services = data.results
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.servicesLoading = false
    }
  }

  async created() {
    await this.loadServices()
    for (const v of this.services) {
      this.selected.push({
        pk: v.pk,
        state: false,
        title: v.title
      })
    }
  }

  async saveAccessory() {
    let res = []
    for (const v of this.selected) {
      if (v.state) {
        res.push(v.pk)
      }
    }
    await CustomerModule.SetGroupAccessory(res)
    this.$message.success('Группы привязаны')
    this.$emit('done')
  }
}
</script>
