import { CustomerField, IAllCompares, IConditionComponents } from "./types"
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


export const customerFields: CustomerField[] = [
  { v: 0, l: 'Not selected', m: { fieldType: '' } },
  { v: 1, l: 'username', m: { fieldType: 'stringField' } },
  { v: 2, l: 'fio', m: { fieldType: 'stringField' } },
  { v: 3, l: 'is_active', m: { fieldType: 'boolField' } },
  { v: 4, l: 'birth_day', m: { fieldType: 'datetimeField' }},
  { v: 5, l: 'create_date', m: { fieldType: 'datetimeField' }},
  { v: 6, l: 'is_admin', m: { fieldType: 'boolField' }},
  { v: 7, l: 'telephone', m: { fieldType: 'stringField' }},
  { v: 8, l: 'sites', m: { fieldType: 'm2mField' }},
  { v: 9, l: 'current_service', m: { fieldType: 'one2oneField' }},
  { v: 10, l: 'group', m: {fieldType: 'fkField' }},
  { v: 11, l: 'address', m: {fieldType: '-' }},
  { v: 12, l: 'balance', m: { fieldType: 'numberField' } },
  { v: 13, l: 'description', m: { fieldType: 'stringField' }},
  { v: 14, l: 'device', m: { fieldType: 'fkField' }},
  { v: 15, l: 'dev_port', m: {fieldType: 'fkField' }},
  { v: 16, l: 'is_dynamic_ip', m: { fieldType: 'boolField' }},
  { v: 17, l: 'gateway', m: { fieldType: 'fkField' }},
  { v: 18, l: 'auto_renewal_service', m: { fieldType: 'boolField' }},
  { v: 19, l: 'last_connected_service', m: { fieldType: 'fkField'}},
]