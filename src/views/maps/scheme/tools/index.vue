<template lang="pug">
  el-card(shadow="hover" :body-style="{ padding: 0 }")
    template(v-slot:header) Панель инструментов
    tool-item(
      v-for="(n, i) in componentNodesGetter"
      :key="i"
      :nodeItem="n"
    )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { nodes } from "../node_comps/index"
import ToolItem from './tool-item.vue'

@Component({
  name: 'ToolsIndex',
  components: {
    ToolItem
  }
})
export default class extends Vue {
  get componentNodesGetter() {
    return nodes
  }
}
</script>
