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
      icon='el-icon-upload'
      type='primary' size='mini'
      @click="saveAccessory"
    ) Сохранить
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { IService } from '@/api/services/types'
import { CustomerModule } from '@/store/modules/customers/customer'
import { getServices } from '@/api/services/req'

interface SelectedState {
  pk: number
  state: boolean
  title: string
}

@Component({
  name: 'ServiceAccessory'
})
export default class extends Vue {
  @Prop({ required: true }) private groupId!: number

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

  @Watch('groupId')
  private onGroupChanged(grpId: number) {
    this.loadSelectedService(grpId)
  }

  private async loadSelectedService(groupId: number) {
    const { data } = await getServices({
      groups: groupId,
      fields: 'pk',
      page: 1,
      page_size: 9999999
    })
    const selectedIds = data.results.map(s => s.pk)
    this.selected = this.services.map(s => ({
      pk: s.pk,
      state: selectedIds.includes(s.pk),
      title: s.title
    }))
  }

  created() {
    this.loadServices().then(() => {
      this.loadSelectedService(this.groupId)
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
