import Drawflow from 'drawflow'
import VueClassContainer from './class-container'
import Router from "./router.vue"
import SwitchNode from './switch.vue'

const nodes: VueClassContainer[] = [
  new VueClassContainer(Router, 'Роутер', 2, 2),
  new VueClassContainer(SwitchNode, 'Свич', 12, 12)
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
