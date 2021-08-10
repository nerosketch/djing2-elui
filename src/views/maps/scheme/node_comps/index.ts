import Drawflow from 'drawflow'
import VueClassContainer from './class-container'
import Test from "./test.vue"
import Entrypoint from "./entrypoint.vue"
import Device from './device.vue'

const nodes: VueClassContainer[] = [
  new VueClassContainer(Test, 'Тест'),
  new VueClassContainer(Entrypoint, 'Точка входа', 0, 1),
  new VueClassContainer(Device, 'Устройство', 1, 1, { text: '' })
]

function registerNodes(editor: Drawflow) {
  nodes.forEach(n => {
    // console.log(n, n.name)
    const props = {
      dfeditor: editor,
      dfnode: n
    }
    editor.registerNode(n.name, n.v, props, null)
  })
}

export {
  nodes,
  registerNodes,
  VueClassContainer
}
