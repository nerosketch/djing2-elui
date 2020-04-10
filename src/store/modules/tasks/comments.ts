import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { IExtraComment } from '@/api/tasks/types'
import { getComment, addComment, changeComment, delComment } from '@/api/tasks/req'


@Module({ dynamic: true, store, name: 'comment' })
class Comment extends VuexModule implements IExtraComment {
  id = 0
  author_id = 0
  author_name = ''
  author_avatar = ''
  text = ''
  date_create = ''
  task = 0

  @Mutation
  public SET_ALL(data: IExtraComment) {
    this.id = data.id
    this.author_id = data.author_id
    this.author_name = data.author_name!
    this.author_avatar = data.author_avatar!
    this.text = data.text
    this.date_create = data.date_create
    this.task = data.task
  }

  @Mutation
  public RESET_ALL() {
    this.id = 0
    this.author_id = 0
    this.author_name = ''
    this.author_avatar = ''
    this.text = ''
    this.date_create = ''
    this.task = 0
  }

  @Action
  public async GetComment(id: number) {
    const r = await getComment(id)
    this.SET_ALL(r.data)
    return r
  }

  @Action
  public async AddComment(c: IExtraComment) {
    const { data } = await addComment(c)
    return data
  }

  @Action
  public async SaveComment() {
    const r = await changeComment(this.id, this)
    this.SET_ALL(r.data)
    return r
  }

  @Action
  public async DelComment(id: number) {
    await delComment(id)
    this.RESET_ALL()
  }

  @Action
  public async PatchComment(info: any) {
    const { data } = await changeComment(this.id, info)
    this.SET_ALL(data)
  }
}
export const CommentModule = getModule(Comment)
