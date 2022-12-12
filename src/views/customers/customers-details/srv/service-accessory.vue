<template lang="pug">
  div
    el-checkbox(
      v-for="srv in selected"
      :key="srv.id"
      :label="srv.title"
      v-model="srv.state")

    el-divider

    el-button(
      icon="el-icon-upload"
      type="primary"
      @click="saveAccessory")
      | {{ $t('save') }}
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { IService } from '@/api/services/types'
import { CustomerModule } from '@/store/modules/customers/customer'
import { getServices } from '@/api/services/req'

interface SelectedState {
  id: number
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
      const { data } = await getServices({
        fields: 'id,title'
      } as any) as any
      this.services = data
    } finally {
      this.servicesLoading = false
    }
  }

  @Watch('groupId')
  private onGroupChanged(grpId: number) {
    this.loadSelectedService(grpId)
  }

  private async loadSelectedService(groupId: number) {
    this.servicesLoading = true
    try {
      const { data } = await getServices({
        groups: groupId,
        fields: 'id'
      })
      const selectedIds = data.results.map(s => s.id)
      this.selected = this.services.map(s => ({
        id: s.id,
        state: selectedIds.includes(s.id),
        title: s.title
      }))
    } finally {
      this.servicesLoading = false
    }
  }

  created() {
    this.loadServices().then(() => {
      this.loadSelectedService(this.groupId)
    })
  }

  async saveAccessory() {
    const selectedState = this.selected.filter(s => s.state)
    const res = selectedState.map(s => s.id)
    await CustomerModule.SetServiceGroupAccessory(res)
    this.$message.success(
      this.$tc('customers.groupsSuccessAttached')
    )
    this.$emit('done')
  }
}
</script>
