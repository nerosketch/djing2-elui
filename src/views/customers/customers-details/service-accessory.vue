<template lang="pug">
  div
    el-checkbox(
      v-for="srv in selected"
      :key="srv.pk"
      :label="srv.title"
      v-model="srv.state"
    )
    el-divider
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
      const { data } = await getServices() as any
      this.services = data
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.servicesLoading = false
    }
  }

  created() {
    this.loadServices().then(() => {
      this.selected = this.services.map(srv => ({
        pk: srv.pk,
        state: false,
        title: srv.title
      }))
    })
  }

  async saveAccessory() {
    let selectedState = this.selected.filter(s => s.state)
    let res = selectedState.map(s => s.pk)
    await CustomerModule.SetGroupAccessory(res)
    this.$message.success('Группы привязаны')
    this.$emit('done')
  }
}
</script>
