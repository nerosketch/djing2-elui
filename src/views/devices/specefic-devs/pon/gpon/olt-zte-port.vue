<template>
  <div class="port">
    <div class="content" :class="{'port-available': port.fb_onu_num > 0}"><span>{{ port.fb_name }}</span><b>{{ port.fb_onu_num }}</b>
      <port-svg-icon></port-svg-icon>
      <el-button-group>
        <el-button icon="el-icon-view" @click="onuListDialog=true" :disabled="port.fb_onu_num === 0"></el-button>
        <el-button icon="el-icon-lock" disabled></el-button>
      </el-button-group>
    </div>
    <el-dialog top="5vh" title="$t('spisok-onu-na-glazu')" :visible.sync="onuListDialog" :close-on-click-modal="false">
      <onu-on-fiber :devId="devId" :fiberAddr="port.fb_id"></onu-on-fiber>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { IDevFiber } from '@/api/devices/types'
import OnuOnFiber from './onu-on-fiber.vue'
import PortSvgIcon from './port-svg-icon.vue'

@Component({
  name: 'OltZtePort',
  components: { OnuOnFiber, PortSvgIcon }
})
export default class extends Vue {
  @Prop({ default: 0 }) private devId!: number
  @Prop({ default: null }) private port!: IDevFiber | null
  private onuListDialog = false
}
</script>

<style lang="scss">
.port {

  .content {
    padding: 5px 8px 3px 8px;
    color: #e3f1fd;
    margin: 5px;
    border-radius: 5px;
    border: 1px solid #b9b9b9;
    width: 105px;
    height: 128px;
    display: block;

    b {
      position: relative;
      top: 16px;
      left: 1px;
      color: #ca4545;
      font-size: 21px;
    }

    span {
      color: #030104;
    }

    span, b {
      display: block;
      text-align: center;
    }

    svg {
      width: 65px;
      display: block;
      margin: -24px 0 4px 12px;
    }
  }

  .port-available {
    background-color: #b9ffd8;
  }
}

</style>
