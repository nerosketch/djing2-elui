<template lang="pug">
  el-form(
    v-loading='loading'
  )
    el-form-item(
      label="Услуга"
      prop='service_id'
    )
      el-select(v-model="serviceId")
        el-option(
          v-for="srv in services"
          :key="srv.pk"
          :label="srv.title"
          :value="srv.pk"
        )
    el-form-item(
      label="Дата завершения"
      prop='deadline'
    )
      el-date-picker(
        v-model="deadline"
        type="datetime"
        value-format="yyyy-MM-ddTHH:mm"
      )
    el-form-item
      el-button(type="success" @click="onSubmit" :loading="loading") Купить
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { CustomerModule } from '@/store/modules/customers/customer'
import { IService } from '@/api/services/types'

@Component({
  name: 'buy-service'
})
export default class extends Vue {
  private loading = false
  private serviceId: number = 0
  private deadline?: string = ''

  @Prop({ default: [] })
  private services!: IService[]

  @Prop({ default: 0 })
  private selectedServiceId!: number

  @Watch('selectedServiceId')
  private onSelectedServiceIdChanged(v: number) {
    this.serviceId = v
  }

  @Watch('serviceId')
  private onServiceIdChanged(v: number) {
    for (const srv of this.services) {
      if (srv.pk === v) {
        this.deadline = srv.planned_deadline
        return
      }
    }
  }

  created() {
    if (this.selectedServiceId > 0) {
      this.serviceId = this.selectedServiceId
    } else if (this.services.length > 0) {
      this.serviceId = this.services[0].pk
    }
  }

  private async onSubmit() {
    this.loading = true
    if (this.serviceId === 0) {
      this.$message.error('Надо выбрать услугу')
      return
    }
    await CustomerModule.PickService(
      this.serviceId, this.deadline
    )
    this.loading = false
    this.$emit('done')
  }
}
</script>
