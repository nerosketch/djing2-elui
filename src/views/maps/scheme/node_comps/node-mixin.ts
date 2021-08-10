import Drawflow from 'drawflow'
import { Component, Vue, Prop } from 'vue-property-decorator'
import VueClassContainer from './class-container'

@Component({
  name: 'NodeMixin'
})
export default class extends Vue {
  @Prop({ required: true })
  protected dfeditor!: Drawflow

  @Prop({ required: true })
  protected dfnode!: VueClassContainer

  protected nodeId = 0

  created() {
    // Catch nodeId
    const localThis = this as any
    const _nodeCreatedCallback = (nid: number) => {
      localThis.nodeId = nid
      localThis.dfeditor.removeListener('nodeCreated', _nodeCreatedCallback)
    }
    this.dfeditor.on('nodeCreated', _nodeCreatedCallback)
    // end Catch nodeId
  }
}
