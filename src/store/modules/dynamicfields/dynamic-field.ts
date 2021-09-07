/* eslint-disable camelcase */
import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { IDynamicField } from '@/api/dynamic-fields/types'
import { addField, delField, getField, patchField } from '@/api/dynamic-fields/req'

@Module({ dynamic: true, store, name: 'dynamicfield' })
class DynamicField extends VuexModule implements IDynamicField {
  public id = 0
  public title = ''
  public field_type = 0
  public field_type_name = ''
  public groups: number[] = []

  @Mutation
  public SET_ALL_DYFIELD(data: IDynamicField) {
    this.id = data.id
    this.title = data.title
    this.field_type = data.field_type
    this.field_type_name = data.field_type_name
    this.groups = data.groups
    return this
  }

  @Mutation
  public RESET_ALL_DYFIELD() {
    this.id = 0
    this.title = ''
    this.field_type = 0
    this.field_type_name = ''
    this.groups = []
    return this
  }

  @Action
  public async GetField(fId: number) {
    const { data } = await getField(fId)
    this.SET_ALL_DYFIELD(data)
    return data
  }

  @Action
  public async AddField(field: object) {
    const { data } = await addField(field)
    this.SET_ALL_DYFIELD(data)
    return data
  }

  @Action
  public async PatchField(newData: object) {
    const { data } = await patchField(this.id, newData)
    this.SET_ALL_DYFIELD(data)
    return data
  }

  @Action
  public async DeleteField(fieldId: number) {
    await delField(fieldId)
    this.RESET_ALL_DYFIELD()
  }
}

export const DynamicFieldModule = getModule(DynamicField)
