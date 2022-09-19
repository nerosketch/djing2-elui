import { IAllCompares, IConditionComponents } from "./api/types"
import { Input, InputNumber, DatePicker, Select, Switch } from 'element-ui'

export const compares: IAllCompares = {
  stringField: [
    { v: 1, l: 'equal' },
    { v: 2, l: 'contains' },
    { v: 3, l: 'icontains' },
    { v: 4, l: 'empty' },
    { v: 5, l: 'null' },
  ],
  numberField: [
    { v: 1, l: 'gte' },
    { v: 2, l: 'gt' },
    { v: 3, l: 'lte' },
    { v: 4, l: 'lt' },
    { v: 5, l: 'equal' },
  ],
  boolField: [
    { v: 1, l: 'equal' },
    { v: 2, l: 'not equal' },
  ],
  datetimeField: [
    { v: 1, l: 'gte' },
    { v: 2, l: 'gt' },
    { v: 3, l: 'lte' },
    { v: 4, l: 'lt' },
    { v: 5, l: 'equal' },
  ],
  m2mField: [
    {v: 1, l: 'in selected'},
  ],
  one2oneField: [
    {v: 1, l: 'equal'},
    {v: 2, l: 'empty' },
    {v: 3, l: 'children'}
  ],
  fkField: [
    {v: 1, l: 'equal'},
    {v: 2, l: 'empty' },
    {v: 3, l: 'children'}
  ]
}

export const conditionComponents: IConditionComponents = {
  stringField: Input,
  numberField: InputNumber,
  boolField: Switch,
  datetimeField: DatePicker,
  m2mField: Select,
  // one2oneField:
  fkField: Select
}
