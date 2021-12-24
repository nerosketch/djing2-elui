<template lang="pug">
  el-form(
    ref="poolfrm"
    label-width="120px"
    status-icon
    :rules="frmRules"
    :model="frmMod"
    v-loading="isLoading")
    el-form-item(label="$t('podset')", prop="network")
      el-input(v-model="frmMod.network")
  
    el-form-item(label="$t('nach-ip')", prop="ip_start")
      el-input(v-model="frmMod.ip_start")
  
    el-form-item(label="$t('kon-ip')", prop="ip_end")
      el-input(v-model="frmMod.ip_end")
  
    el-form-item(label="$t('gruppy-2')")
      groups-choice(v-model="frmMod.groups", multiple)
  
    el-form-item(label="$t('shlyuz')", prop="gateway")
      el-input(v-model="frmMod.gateway")
  
    el-form-item(label="$t('vlan')")
      el-select(v-model="frmMod.vlan_if", v-loading="vlanLoading")
        el-option(
          v-for="v in vlans"
          :key="v.id"
          :label="$t('v-vid-v-title', [v.vid, v.title])"
          :value="v.id")
  
    el-form-item(label="$t('tip-seti')")
      el-select(v-model="frmMod.kind")
        el-option(
          v-for="k in networkPoolKinds"
          :key="k.val"
          :label="k.title"
          :value="k.val")
  
    el-form-item(label="$t('dinamicheskii-1')")
      el-checkbox(v-model="frmMod.is_dynamic")
        | {{ frmMod.is_dynamic ? 'Да' : 'Нет' }}
  
    el-form-item(label="$t('opisanie-7')", prop="description")
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
      { required: true, message: this.$t('podset-nado-ukazat'), trigger: 'blur' },
      { validator: ipAddrMaskValidator, trigger: 'change', message: this.$t('primer-podseti-192-168-0-0-24') }
    ],
    description: [
      { required: true, message: this.$t('kakae-to-opisanie-nuzhno'), trigger: 'blur' }
    ],
    ip_start: [
      { required: true, message: this.$t('startovyi-ip-nado-ukazat'), trigger: 'blur' },
      { validator: ipAddrValidator, trigger: 'change', message: this.$t('primer-ip-192-168-0-23-2') }
    ],
    ip_end: [
      { required: true, message: this.$t('konechnyi-ip-nado-ukazat'), trigger: 'blur' },
      { validator: ipAddrValidator, trigger: 'change', message: this.$t('primer-ip-192-168-0-23-3') }
    ],
    gateway: [
      { required: true, message: this.$t('shlyuz-nado-ukazat'), trigger: 'blur' },
      { validator: ipAddrValidator, trigger: 'change', message: this.$t('primer-shlyuza-192-168-0-1') }
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
    { val: 0, title: this.$t('ne-opredelyon') },
    { val: 1, title: this.$t('internet') },
    { val: 2, title: this.$t('gostevoi') },
    { val: 3, title: this.$t('doverennyi') },
    { val: 4, title: this.$t('ustroistva') },
    { val: 5, title: this.$t('administrativnyi') }
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
