<template lang="pug">
div
  .full_height(ref="area")
  .absolute_block
    el-card(shadow="hover")
      template(v-slot:header) Панель инструментов
    tool-item(
      v-for="(n, i) in componentNodesGetter"
      :key="i"
      :nodeItem="n"
    )
</template>

<script lang="ts">
import Drawflow from "drawflow"
import { Component, Vue } from 'vue-property-decorator'
import 'drawflow/dist/drawflow.min.css'
import { registerNodes } from "./node_comps/index"
import VueClassContainer from './node_comps/class-container'
import { nodes } from "./node_comps/index"
import ToolItem from './tool-item.vue'


function _clc(editor: any, pos: number, p: string) {
  const ep = editor.precanvas
  const epc = ep.clientHeight
  return pos * (epc / (epc * editor.zoom)) - ep.getBoundingClientRect()[p] * (epc / (epc * editor.zoom))
}

@Component({
  name: 'MapsSchemeIndex',
  components: {
    ToolItem
  }
})
export default class extends Vue {
  public readonly $refs!: {
    area: HTMLDivElement
  }

  private editor?: Drawflow

  mounted() {
    const editor = new Drawflow(this.$refs.area, Vue)
    editor.zoom_max = 1.6
    editor.zoom_min = 0.5
    editor.zoom_value = 0.1

    registerNodes(editor)

    editor.start()

    editor.addNode(
      'myentr',    // name
      1,           // inputs
      1,           // outputs
      100,   // posx
      200,   // posy
      'Entrypoint',    // className
      {},          // data
      'Entrypoint',    // html
      'vue',       // typenode
    )

    editor.addConnection(1, 2, "output_1", "input_1");
    editor.addConnection(1, 3, "output_1", "input_1");

    editor.on("nodeCreated", this.onNodeCreated)
    editor.on("nodeSelected", this.onNodeSelected)
    // etc...

    this.editor = editor
  }

  private onNodeCreated() {
    console.log("On node created")
  }

  private onNodeSelected() {
    console.log("On node selected")
  }

  public addNode(nodeContainer: VueClassContainer, pos_x: number, pos_y: number) {
    if (!this.editor)
      return
    const editor = this.editor

    pos_x = _clc(editor, pos_x, "x")
    pos_y = _clc(editor, pos_y, "y")

    this.editor.addNode(
      nodeContainer.name,
      nodeContainer.inputs,
      nodeContainer.outputs,
      pos_x,
      pos_y,
      nodeContainer.name,
      JSON.parse(JSON.stringify(nodeContainer.data)),
      nodeContainer.name,
      "vue"
    )
  }

  beforeDestroy() {
    if (this.editor) {
      this.editor.clear()
    }
  }

  get componentNodesGetter() {
    return nodes
  }
}
</script>

<style scoped>
.full_height {
  height: 100vh;
}

.absolute_block {
  position: absolute;
  right: 46px;
  top: 10px;
  z-index: 2;
}
</style>
