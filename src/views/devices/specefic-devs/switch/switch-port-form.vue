<template lang="pug">
  el-form(
    ref="form"
    label-width="100px"
    status-icon
    :rules="frmRules"
    :model="frmMod"
    v-loading="loading")
    el-form-item(
      label="№ порта"
      prop="num"
    )
      el-input(
        v-model="frmMod.num"
        type="number"
      )

    el-form-item(
      :label="$t('description')"
      prop="descr"
    )
      el-input(v-model="frmMod.descr")

    el-form-item
      el-button(
        icon="el-icon-upload"
        type="primary"
        @click="onSubmit"
        :loading="loading"
        :disabled="!$perms.devices.change_port")
        | {{ $t('save') }}
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { PortModule } from '@/store/modules/devices/port'

@Component({
  name: 'SwitchPortForm'
})
export default class extends Vue {
  @Prop({ default: 0 }) private deviceId!:number
  @Prop({ default: 0 }) private portId!:number
  @Prop({ default: 0 }) private initialNum!:number
  private loading = false

  private frmRules = {
    descr: [
      { required: true, message: this.$tc('weNeedToNameThePort'), trigger: 'blur' }
    ]
  }

  private frmMod = {
    num: PortModule.num || this.initialNum,
    descr: PortModule.descr
  }

  private async loadPort() {
    if (this.portId > 0) {
      this.loading = true
      try {
        const { data } = await PortModule.GetPort(this.portId)
        this.frmMod.num = data.num
        this.frmMod.descr = data.descr
      } finally {
        this.loading = false
      }
    } else {
      this.frmMod.num = this.initialNum
      this.frmMod.descr = ''
    }
  }

  @Watch('portId')
  private onDevPort() {
    this.loadPort()
  }

  @Watch('initialNum')
  private onInNumCh(initialNum: number) {
    this.frmMod.num = initialNum
  }

  private onSubmit() {
    (this.$refs.form as Form).validate(async valid => {
      if (valid) {
        this.loading = true
        let newPort
        if (this.portId > 0) {
          newPort = await PortModule.PatchPort(this.frmMod)
          this.loading = false
          this.$emit('editdone', newPort)
        } else {
          newPort = await PortModule.AddPort(Object.assign({ device: this.deviceId }, this.frmMod))
          this.loading = false
          this.$emit('adddone', newPort)
        }
      } else {
        this.$message.error(this.$tc('fixFormErrs'))
      }
    })
  }

  created() {
    this.loadPort()
  }
}
</script>
