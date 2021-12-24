<template>  
  <el-form v-loading="loading">
    <el-form-item :label="$t('customers.service')">
      <el-select v-model="frmMod.service_id">
        <el-option v-for="srv in services" :key="srv.id" :label="srv.title" :value="srv.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('endDate')">
      <el-date-picker v-model="frmMod.deadline" type="datetime" value-format="yyyy-MM-dd HH:mm" format="d.MM.yyyy HH:mm"></el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="success" @click="onSubmit" :loading="loading" :disabled="!$perms.customers.can_buy_service">{{ $t('buy') }}</el-button>
    </el-form-item>
  </el-form>
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
      this.$message.error(
        this.$t('customers.chooseServiceNecessary').toString()
      )
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
