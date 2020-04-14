<template lang="pug">
  el-form(
    ref='poolfrm'
    status-icon
    :rules='frmRules'
    :model='frmMod'
    v-loading='isLoading'
  )
    el-form-item(
      label="Подсеть"
      prop='network'
    )
      el-input(v-model="frmMod.network")
    el-form-item(
      label="Описание"
      prop='description'
    )
      el-input(v-model="frmMod.description" type="textarea")
    el-form-item(
      label="Нач. ip"
      prop='ip_start'
    )
      el-input(v-model="frmMod.ip_start")
    el-form-item(
      label="Кон. ip"
      prop='ip_end'
    )
      el-input(v-model="frmMod.ip_end")
    el-form-item(
      label="Шлюз"
      prop='gateway'
    )
      el-input(v-model="frmMod.gateway")
    el-form-item
      el-button(type="primary" @click="onSubmit" :loading="isLoading") Сохранить
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { ipAddrValidator, ipAddrMaskValidator } from '@/utils/validate'
import { INetworkIpPool } from '@/api/networks/types'
import { NetworkIpPoolModule } from '@/store/modules/networks/netw_pool'

@Component({
  name: 'pool-form'
})
export default class extends Vue {
  private isLoading = false

  private frmRules = {
    network: [
      { required: true, message: 'Подсеть надо указать', trigger: 'blur' },
      { validator: ipAddrMaskValidator, trigger: 'change', message: 'Пример подсети: 192.168.0.0/24' }
    ],
    description: [
      { required: true, message: 'Какае-то описание нужно', trigger: 'blur' }
    ],
    ip_start: [
      { required: true, message: 'Стартовый ip надо указать', trigger: 'blur' },
      { validator: ipAddrValidator, trigger: 'change', message: 'Пример ip: 192.168.0.23' }
    ],
    ip_end: [
      { required: true, message: 'Конечный ip надо указать', trigger: 'blur' },
      { validator: ipAddrValidator, trigger: 'change', message: 'Пример ip: 192.168.0.23' }
    ],
    gateway: [
      { required: true, message: 'Шлюз надо указать', trigger: 'blur' },
      { validator: ipAddrValidator, trigger: 'change', message: 'Пример шлюза: 192.168.0.1' }
    ]
  }

  private frmMod: INetworkIpPool = {
    id: NetworkIpPoolModule.id,
    network: NetworkIpPoolModule.network,
    kind: NetworkIpPoolModule.kind,
    description: NetworkIpPoolModule.description,
    groups: NetworkIpPoolModule.groups,
    ip_start: NetworkIpPoolModule.ip_start,
    ip_end: NetworkIpPoolModule.ip_end,
    gateway: NetworkIpPoolModule.gateway
  }

  get netId() {
    return NetworkIpPoolModule.id
  }
  @Watch('netId')
  private async onNetwCh() {
    this.frmMod = await NetworkIpPoolModule.GetAllState()
  }

  private onSubmit() {
    (this.$refs['poolfrm'] as Form).validate(async valid => {
      if (valid) {
        this.isLoading = true
        await NetworkIpPoolModule.SET_ALL(this.frmMod)
        const newDat = await NetworkIpPoolModule.SavePool()
        this.isLoading = false
        this.$emit('done', newDat)
      } else {
        this.$message.error('Исправь ошибки в форме')
      }
    })
  }
}
</script>
