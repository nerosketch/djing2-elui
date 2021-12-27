<template lang="pug">
  el-form(
    ref="poolfrm"
    label-width="120px"
    status-icon
    :rules="frmRules"
    :model="frmMod"
    v-loading="isLoading")
    el-form-item(
      :label="$t('subnet')"
      prop="network"
    )
      el-input(v-model="frmMod.network")

    el-form-item(:label="$t('startIp')" prop="ip_start")
      el-input(v-model="frmMod.ip_start")

    el-form-item(:label="$t('ipend')" prop="ip_end")
      el-input(v-model="frmMod.ip_end")

    el-form-item(:label="$t('route.groups')")
      groups-choice(v-model="frmMod.groups" multiple)

    el-form-item(:label="$t('gateway')" prop="gateway")
      el-input(v-model="frmMod.gateway")

    el-form-item(label="Vlan")
      el-select(v-model="frmMod.vlan_if" v-loading="vlanLoading")
        el-option(
          v-for="v in vlans"
          :key="v.id"
          :label="$t('v-vid-v-title', [v.vid, v.title])"
          :value="v.id")

    el-form-item(:label="$t('typeOfNetwork')")
      el-select(v-model="frmMod.kind")
        el-option(
          v-for="k in networkPoolKinds"
          :key="k.val"
          :label="k.title"
          :value="k.val")

    el-form-item(:label="$t('dynamic')")
      el-checkbox(v-model="frmMod.is_dynamic")
        | {{ frmMod.is_dynamic ? 'Да' : 'Нет' }}

    el-form-item(:label="$t('description')" prop="description")
      el-input(
        v-model="frmMod.description"
        type="textarea"
        rows="5"
        autosize)

    el-form-item
      el-button(
        type="primary"
        @click="onSubmit"
        :loading="isLoading"
        :disabled="isFormUntouched")
        | {{ $t('save') }}
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { mixins } from 'vue-class-component'
import { ipAddrValidator, ipAddrMaskValidator } from '@/utils/validate'
import { NetworkIpPoolModule } from '@/store/modules/networks/netw_pool'
import FormMixin from '@/utils/forms'
import VlanMixin from './vlan-mixin'
import { INetworkIpPool } from '@/api/networks/types'
import GroupsChoice from '@/components/Groups/groups-choice.vue'

@Component({
  name: 'pool-form',
  components: {
    GroupsChoice
  }
})
export default class extends mixins(FormMixin, VlanMixin) {
  private isLoading = false

  private frmRules = {
    network: [
      { required: true, message: this.$t('weNeedToSign'), trigger: 'blur' },
      { validator: ipAddrMaskValidator, trigger: 'change', message: this.$t('example1921680024') }
    ],
    description: [
      { required: true, message: this.$t('iNeedADescription'), trigger: 'blur' }
    ],
    ip_start: [
      { required: true, message: this.$t('startPoint'), trigger: 'blur' },
      { validator: ipAddrValidator, trigger: 'change', message: this.$t('example192168023') }
    ],
    ip_end: [
      { required: true, message: this.$t('finalNeedToBeIndicated'), trigger: 'blur' },
      { validator: ipAddrValidator, trigger: 'change', message: this.$t('example192168023') }
    ],
    gateway: [
      { required: true, message: this.$t('youNeedToPointOutTheLock'), trigger: 'blur' },
      { validator: ipAddrValidator, trigger: 'change', message: this.$t('exampleOfLock19216801') }
    ]
  }

  private frmMod: INetworkIpPool = {
    id: NetworkIpPoolModule.id,
    network: NetworkIpPoolModule.network,
    description: NetworkIpPoolModule.description,
    groups: NetworkIpPoolModule.groups,
    ip_start: NetworkIpPoolModule.ip_start,
    ip_end: NetworkIpPoolModule.ip_end,
    gateway: NetworkIpPoolModule.gateway,
    is_dynamic: NetworkIpPoolModule.is_dynamic,
    vlan_if: NetworkIpPoolModule.vlan_if,
    kind: NetworkIpPoolModule.kind
  }

  private networkPoolKinds = [
    { val: 0, title: this.$t('notDefined') },
    { val: 1, title: this.$t('internet') },
    { val: 2, title: this.$t('hotel') },
    { val: 3, title: this.$t('trustee') },
    { val: 4, title: this.$t('route.devices') },
    { val: 5, title: this.$t('administrative') }
  ]

  @Watch('$store.state.netpool', { deep: true })
  private async onNetwCh(nstate: INetworkIpPool) {
    this.frmMod = { ...nstate }
    this.frmInitial = { ...nstate }
  }

  get isNewPool() {
    return NetworkIpPoolModule.id === 0
  }

  created() {
    this.frmInitial = Object.assign({}, this.frmMod)
    this.loadVlans(undefined, 'id,title,vid')
  }

  private onSubmit() {
    (this.$refs.poolfrm as Form).validate(async valid => {
      if (valid) {
        this.isLoading = true
        let newDat
        try {
          if (this.isNewPool) {
            newDat = await NetworkIpPoolModule.AddPool(this.frmMod)
          } else {
            newDat = await NetworkIpPoolModule.PatchPool(this.frmMod)
          }
          this.$emit('done', newDat)
        } catch (err) {
          this.$message.error(err)
        } finally {
          this.isLoading = false
        }
      } else {
        this.$message.error(this.$t('fixFormErrs').toString())
      }
    })
  }
}
</script>
