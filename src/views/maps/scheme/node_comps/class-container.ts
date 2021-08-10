import Vue, { VueConstructor } from "vue"

type VueType = VueConstructor<Vue>

export default class VueClassContainer {
  public v: VueType
  public inputs = 0
  public outputs = 0
  public description: string
  public data = {}
  
  constructor(v: VueType, description: string, inputs?: number, outputs?: number, data?: object) {
    this.v = v
    this.description = description
    this.inputs = inputs || 0
    this.outputs = outputs || 0
    if (data) {
      this.data = data
    }
  }

  public get name() {
    return (this.v as any).options.name
  }
}