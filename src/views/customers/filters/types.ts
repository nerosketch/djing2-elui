export interface IItemType {
  v: number
  l: string
}


export interface ICompareItem extends IItemType {
}


export interface CustomerFieldMeta {
  fieldType: string
}

export interface CustomerField extends IItemType {
  m: CustomerFieldMeta
}

export interface IAllCompares {
  [fieldType: string]: ICompareItem[]
}

export interface IConditionComponents {
  [fieldType: string]: any
}
