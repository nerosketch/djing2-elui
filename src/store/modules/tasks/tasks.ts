import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { ITask, ITaskPriority, ITaskState, ITaskType } from '@/api/tasks/types'
import { getTask, addTask, changeTask, delTask, finishTask, failTask, remindTask, getActiveTaskCount } from '@/api/tasks/req'


@Module({ dynamic: true, store, name: 'task' })
class Task extends VuexModule implements ITask {
  id = 0
  author_full_name = ''
  customer_full_name = ''
  priority_name = ''
  time_of_create = ''
  time_diff = ''
  mode_str = ''
  state_str = ''
  recipients: number[] = []
  descr = ''
  priority = ITaskPriority.LOW
  out_date = ''
  task_state = ITaskState.NEW
  mode = ITaskType.NOT_CHOSEN
  author = 0
  customer = 0
  activeTaskCount = 0

  @Mutation
  public SET_ALL(data: ITask) {
    this.id = data.id
    this.author_full_name = data.author_full_name!
    this.customer_full_name = data.customer_full_name!
    this.priority_name = data.priority_name!
    this.time_of_create = data.time_of_create!
    this.time_diff = data.time_diff!
    this.mode_str = data.mode_str!
    this.state_str = data.state_str!
    this.recipients = data.recipients
    this.descr = data.descr
    this.priority = data.priority
    this.out_date = data.out_date
    this.task_state = data.task_state
    this.task_state = data.task_state
    this.mode = data.mode
    this.author = data.author
    this.customer = data.customer!
  }

  @Mutation
  public RESET_ALL() {
    this.id = 0
    this.author_full_name = ''
    this.customer_full_name = ''
    this.priority_name = ''
    this.time_of_create = ''
    this.time_diff = ''
    this.mode_str = ''
    this.state_str = ''
    this.recipients = []
    this.descr = ''
    this.priority = ITaskPriority.LOW
    this.out_date = ''
    this.task_state = ITaskState.NEW
    this.mode = ITaskType.NOT_CHOSEN
    this.author = 0
    this.customer = 0
  }

  @Mutation
  private SET_TASK_COUNT(tc: number) {
    this.activeTaskCount = tc
  }

  @Action
  public async GetTask(id: number) {
    const r = await getTask(id)
    this.SET_ALL(r.data)
    return r
  }

  @Action
  public async AddTask(task: ITask) {
    const { data } = await addTask(task)
    return data
  }

  @Action
  public async SaveTask() {
    const r = await changeTask(this.id, this)
    this.SET_ALL(r.data)
    return r
  }

  @Action
  public async DelTask(id: number) {
    await delTask(id)
    this.RESET_ALL()
  }

  @Action
  public async PatchTask(info: any) {
    const { data } = await changeTask(this.id, info)
    this.SET_ALL(data)
  }

  @Action
  public async FinishTask() {
    await finishTask(this.id)
  }
  @Action
  public async FailTask() {
    await failTask(this.id)
  }
  @Action
  public async RemindTask() {
    await remindTask(this.id)
  }

  @Action
  public StartWatchActiveTaskCount() {
    setInterval(async () => {
      const { data } = await getActiveTaskCount()
      this.SET_TASK_COUNT(data)
    }, 5000)
  }
}
export const TaskModule = getModule(Task)
