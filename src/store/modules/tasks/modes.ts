import { VuexModule, Module, Mutation, getModule, Action } from 'vuex-module-decorators'
import store from '@/store'
import { ITaskMode } from '@/api/tasks/types'
import { getMode, changeMode, addMode } from '@/api/tasks/req'

@Module({ dynamic: true, store, name: 'taskmode' })
class TaskMode extends VuexModule implements ITaskMode {
  public id = 0
  public title = ''

  @Mutation
  public SET_ALL_TASK_MODE(data: ITaskMode) {
    this.id = data.id
    this.title = data.title
  }

  @Mutation
  public RESET_ALL_TASK_MODE() {
    this.id = 0
    this.title = ''
  }

  @Action
  public async GetTaskMode(id: number) {
    const { data } = await getMode(id)
    this.SET_ALL_TASK_MODE(data)
    return data
  }

  @Action
  public async SaveTaskMode(title: string) {
    if (this.id > 0) {
      const { data } = await changeMode(this.id, {
        title
      })
      this.SET_ALL_TASK_MODE(data)
      return data
    } else {
      throw new Error('current mode id == 0')
    }
  }

  @Action
  public async AddTaskMode(title: string) {
    const { data } = await addMode({
      title
    })
    this.SET_ALL_TASK_MODE(data)
    return data
  }

  // @Action
  // public async DelMode() {
  //   await delMode(this.id)
  //   this.RESET_ALL_TASK_MODE()
  // }
}

export const TaskModeModule = getModule(TaskMode)
