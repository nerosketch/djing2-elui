import { IAllCompares, IConditionComponents } from "@/api/customers/types"
import { Input, InputNumber, Select, Switch } from 'element-ui'
import DatetimeComponent from '@/components/Proxy/datetime-component.vue'
import DateComponent from '@/components/Proxy/date-component.vue'

export const compares: IAllCompares = {
  stringField: [
    { v: 1, l: 'equal ==' },
    { v: 2, l: 'contains' },
    { v: 3, l: 'icontains' },
    // { v: 4, l: 'empty' },
    // { v: 5, l: 'null' },
    { v: 6, l: 'starts with ...' },
    { v: 7, l: '... ends with' },
  ],
  numberField: [
    { v: 1, l: 'gte >=' },
    { v: 2, l: 'gt >' },
    { v: 3, l: 'lte <=' },
    { v: 4, l: 'lt =' },
    { v: 5, l: 'equal ==' },
  ],
  boolField: [
    { v: 1, l: 'equal ==' },
    // { v: 2, l: 'not equal !=' },
  ],
  datetimeField: [
    { v: 1, l: 'gte >=' },
    { v: 2, l: 'gt >' },
    { v: 3, l: 'lte <=' },
    { v: 4, l: 'lt =' },
    { v: 5, l: 'equal ==' },
  ],
  dateField: [
    { v: 1, l: 'gte >=' },
    { v: 2, l: 'gt >' },
    { v: 3, l: 'lte <=' },
    { v: 4, l: 'lt =' },
    { v: 5, l: 'equal ==' },
  ],
  m2mField: [
    { v: 1, l: 'in selected' },
  ],
  one2oneField: [
    { v: 1, l: 'equal ==' },
    // {v: 2, l: 'empty' },
    // {v: 3, l: 'children'}
  ],
  fkField: [
    { v: 1, l: 'equal ==' },
    // {v: 2, l: 'empty' },
    // {v: 3, l: 'children'}
  ]
}

export const conditionComponents: IConditionComponents = {
  stringField: Input,
  numberField: InputNumber,
  boolField: Switch,
  datetimeField: DatetimeComponent,
  dateField: DateComponent,
  m2mField: Select,
  // one2oneField:
  fkField: Select
}

export const aggregates = [
  { v: 0, l: '—'        },
  { v: 1, l: 'Count'    },
  { v: 2, l: 'Sum'      },
  { v: 3, l: 'Max'      },
  { v: 4, l: 'Min'      },
  { v: 5, l: 'ArrayAgg' },
  { v: 6, l: 'Avg'      },
  { v: 7, l: 'StdDev'   },
]
