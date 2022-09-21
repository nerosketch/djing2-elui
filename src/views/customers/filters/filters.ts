import { CustomerField, IAggregate, IAggregateFilter, IAllCompares, IConditionComponents } from "@/api/customers/types"
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

export const aggregates: IAggregate[] = [
  { v: 0, l: '—',      postfix: null,     },
  { v: 1, l: 'Count',  postfix: 'count'   },
  { v: 2, l: 'Sum',    postfix: 'sum'     },
  { v: 3, l: 'Max',    postfix: 'max'     },
  { v: 4, l: 'Min',    postfix: 'min'     },
  { v: 6, l: 'Avg',    postfix: 'avg'     },
  { v: 7, l: 'StdDev', postfix: 'stddev'  },
]

function aggregateFilter2CustomerField(af: IAggregateFilter): CustomerField | undefined {
  const aggrs = aggregates.filter(a => a.v === af.aggr && Boolean(a.postfix))
  if (aggrs.length > 0) {
    const aggr = aggrs[0]
    return {
      l: `${af.filter.field}__${aggr.postfix}`,
      m: {
        fieldType: 'numberField'
      }
    }
  }
}

export function fieldsFromAggrs(aggrs: IAggregateFilter[]): CustomerField[] {
  let newCFs = aggrs.map(aggregateFilter2CustomerField)
  if (newCFs.length > 0) {
    newCFs = newCFs.filter(a => Boolean(a))
    return newCFs as CustomerField[]
  }
  return []
}
