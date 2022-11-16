import { VuexModule, Module, Mutation, getModule, Action } from 'vuex-module-decorators'
import store from '@/store'
import { ITaskFinishDocument } from '@/api/tasks/types'
import { addTaskFinishDoc, changeTaskFinishDoc, getTaskFinishDoc } from '@/api/tasks/req'

@Module({ dynamic: true, store, name: 'taskfinishdoc' })
class TaskFinishDocument extends VuexModule implements ITaskFinishDocument {
  id = 0
  code = ''
  // act_num: string | null = null
  author_id = 0
  task_id = 0
  create_time = ''
  finish_time = ''
  cost = 0
  task_mode_id = 0
  recipients: number[] = []

  @Mutation
  public SET_ALL_TASK_FINISH_DOC(doc: ITaskFinishDocument) {
    this.id = doc.id
    this.code = doc.code
    // this.act_num = doc.act_num
    this.author_id = doc.author_id
    this.task_id = doc.task_id
    this.create_time = doc.create_time
    this.finish_time = doc.finish_time
    this.cost = doc.cost
    this.task_mode_id = doc.task_mode_id
    this.recipients = doc.recipients
  }

  @Mutation
  public RESET_ALL_TASK_FINISH_DOC() {
    this.id = 0
    this.code = ''
    // this.act_num = null
    this.author_id = 0
    this.task_id = 0
    this.create_time = ''
    this.finish_time = ''
    this.cost = 0
    this.task_mode_id = 0
    this.recipients = []
  }

  @Mutation
  public SET_TASK_FIN_DOC_TASK_ID(taskId: number) {
    this.task_id = taskId
  }

  @Action
  public async GetFinishDoc(taskId: number) {
    const doc = await getTaskFinishDoc(taskId)
    if (doc) {
      this.SET_ALL_TASK_FINISH_DOC(doc)
    } else {
      this.RESET_ALL_TASK_FINISH_DOC()
      this.SET_TASK_FIN_DOC_TASK_ID(taskId)
    }
    return doc
  }

  @Action
  public async AddFinishDoc(info: object) {
    const { data } = await addTaskFinishDoc(info)
    this.SET_ALL_TASK_FINISH_DOC(data)
    return data
  }

  @Action
  public async PatchFinishDoc(info: object) {
    const { data } = await changeTaskFinishDoc(this.id, info)
    this.SET_ALL_TASK_FINISH_DOC(data)
    return data
  }

  // @Action
  // public async DelFinishDoc(id: number) {
  //   await
  // }
}

export const TaskFinishDocumentModule = getModule(TaskFinishDocument)
