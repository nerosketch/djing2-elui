<template>  
  <el-select v-model="selectedGw" v-loading="loadingGws" :disabled="gwlist.length == 0">
    <el-option v-for="gw in gwlist" :key="gw.id" :label="gw.title" :value="gw.id"></el-option>
  </el-select>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import GwsMethods from '@/views/gateways/gws-methods'

@Component({
  name: 'GwsSelectfield'
})
export default class extends mixins(GwsMethods) {
  @Prop({ default: 0 }) private value!: number
  private selectedGw = 0

  created() {
    this.selectedGw = this.value
    this.loadGateways('id,title').then(() => {
      if (this.value === 0 && this.gwlist.length > 0) {
        this.selectedGw = this.gwlist[0].id
      }
    })
  }

  @Watch('selectedGw')
  private onChGw(gwId: number) {
    this.$emit('input', gwId)
  }

  @Watch('value')
  protected onChVal(gwId: number) {
    this.selectedGw = gwId
  }
}
</script>
