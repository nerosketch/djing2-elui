/* eslint-disable camelcase */
import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { ITaskDocumentAttachment } from '@/api/tasks/types'
import { getAttachment, delAttachment, addAttachment } from '@/api/tasks/req'

@Module({ dynamic: true, store, name: 'comment' })
class TaskAttachment extends VuexModule implements ITaskDocumentAttachment {
  id = 0
  title = ''
  doc_file = ''
  create_time = ''
  author_id = 0
  task_id = 0

  @Mutation
  public SET_ALL_ATTACHMENT(data: ITaskDocumentAttachment) {
    this.id = data.id
    this.title = data.title
    this.doc_file = data.doc_file
    this.create_time = data.create_time
    this.author_id = data.author_id
    this.task_id = data.task_id
  }

  @Mutation
  public RESET_ALL_ATTACHMENT() {
    this.id = 0
    this.title = ''
    this.doc_file = ''
    this.create_time = ''
    this.author_id = 0
    this.task_id = 0
  }

  @Action
  public async AddAttachment(newAtt: object) {
    const { data } = await addAttachment(newAtt)
    this.SET_ALL_ATTACHMENT(data)
    return data
  }

  @Action
  public async GetAttachment(id: number) {
    const r = await getAttachment(id)
    this.SET_ALL_ATTACHMENT(r.data)
    return r
  }

  @Action
  public async DelAttachment(id: number) {
    await delAttachment(id)
    this.RESET_ALL_ATTACHMENT()
  }
}
export const TaskAttachmentModule = getModule(TaskAttachment)
