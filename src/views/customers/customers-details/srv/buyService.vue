<template lang="pug">
  el-form(
    v-loading='loading'
  )
    el-form-item(label="Услуга")
      el-select(v-model="frmMod.service_id")
        el-option(
          v-for="srv in services"
          :key="srv.id"
          :label="srv.title"
          :value="srv.id"
        )
    el-form-item(label="Дата завершения")
      el-date-picker(
        v-model="frmMod.deadline"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm"
        format="d.MM.yyyy HH:mm"
      )
    el-form-item
      el-button(
        type="success" @click="onSubmit"
        :loading="loading"
        :disabled="!$perms.customers.can_buy_service"
      ) Купить
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { CustomerModule } from '@/store/modules/customers/customer'
import { IService } from '@/api/services/types'

@Component({
  name: 'BuyService'
})
export default class extends Vue {
  private loading = false

  private frmMod = {
    service_id: 0,
    deadline: ''
  }

  @Prop({ default: [] })
  private services!: IService[]

  @Prop({ default: 0 })
  private selectedServiceId!: number

  @Watch('selectedServiceId')
  private onSelectedServiceIdChanged(v: number) {
    this.frmMod.service_id = v
  }

  @Watch('frmMod.service_id')
  private onServiceIdChanged(v: number) {
    for (const srv of this.services) {
      if (srv.id === v) {
        this.frmMod.deadline = srv.planned_deadline
        return
      }
    }
  }

  created() {
    if (this.selectedServiceId > 0) {
      this.frmMod.service_id = this.selectedServiceId
    } else if (this.services.length > 0) {
      this.frmMod.service_id = this.services[0].id
    }
  }

  private async onSubmit() {
    this.loading = true
    if (this.frmMod.service_id === 0) {
      this.$message.error('Надо выбрать услугу')
      return
    }
    try {
      await CustomerModule.PickService(this.frmMod)
      this.$emit('done')
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.loading = false
    }
  }
}
</script>
