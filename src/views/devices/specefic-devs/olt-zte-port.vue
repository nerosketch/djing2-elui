<template lang="pug">
  .port
    div.content
      span port 1/0/2
      img(src="@/assets/ethernet-plug.svg")
      b 2
      el-button-group.btngrp
        el-button(size='mini' icon='el-icon-view' disabled)
        el-button(size='mini' icon='el-icon-lock' disabled)
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { IDevFiber } from '@/api/devices/types'

@Component({
  name: 'OltZtePort'
})
export default class extends Vue {
  @Prop({ default: null }) private port!: IDevFiber | null
}
</script>

<style lang="scss">
.port {

  .content {
    padding: 5px 8px 3px 8px;
    color: #e3f1fd;
    background-color: #fbfdff;
    margin: 14px;
    border-radius: 5px;
    border: 1px solid #b9b9b9;

    b {
      position: relative;
      top: -62px;
      left: 39px;
    }

    span {
      position: relative;
      color: #304156;
      margin-left: 8px;
    }

    .btngrp {
      margin-top: -17px;
    }
  }
}

</style>
