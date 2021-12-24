<template>  
  <div class="tab-container">
    <el-tabs v-model="activeTabName" type="border-card">
      <el-tab-pane label="Тарифы" name="services" lazy>
        <keep-alive>
          <service-list></service-list>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="Периодические платежи" name="periodicpays" lazy>
        <keep-alive>
          <periodic-pay-list></periodic-pay-list>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="Единоразовые платежи" name="shots" lazy>
        <keep-alive>
          <shot-list></shot-list>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import TabMixin from '@/utils/tab-mixin'
import ServiceList from './services-list.vue'
import ShotList from './shot-list.vue'
import PeriodicPayList from './periodicpay-list.vue'

@Component({
  name: 'ServicesIndex',
  components: {
    ServiceList,
    ShotList,
    PeriodicPayList
  }
})
export default class extends mixins(TabMixin) {
  protected activeTabName = 'services'
}
</script>
