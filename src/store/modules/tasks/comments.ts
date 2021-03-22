/* eslint-disable camelcase */
import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { IExtraComment } from '@/api/tasks/types'
import { getComment, changeComment, delComment } from '@/api/tasks/req'

@Module({ dynamic: true, store, name: 'comment' })
class Comment extends VuexModule implements IExtraComment {
  id = 0
  author_id = 0
  author_name = ''
  author_avatar = ''
  text = ''
  date_create = ''
  task = 0
  can_remove = false

  @Mutation
  public SET_ALL_COMMENT(data: IExtraComment) {
    this.id = data.id
    this.author_id = data.author_id
    this.author_name = data.author_name!
    this.author_avatar = data.author_avatar!
    this.text = data.text
    this.date_create = data.date_create
    this.task = data.task
    this.can_remove = data.can_remove!
  }

  @Mutation
  public RESET_ALL_COMMENT() {
    this.id = 0
    this.author_id = 0
    this.author_name = ''
    this.author_avatar = ''
    this.text = ''
    this.date_create = ''
    this.task = 0
    this.can_remove = false
  }

  @Action
  public async GetComment(id: number) {
    const r = await getComment(id)
    this.SET_ALL_COMMENT(r.data)
    return r
  }

  @Action
  public async SaveComment() {
    const r = await changeComment(this.id, this)
    this.SET_ALL_COMMENT(r.data)
    return r
  }

  @Action
  public async DelComment(id: number) {
    await delComment(id)
    this.RESET_ALL_COMMENT()
  }

  @Action
  public async PatchComment(info: any) {
    const { data } = await changeComment(this.id, info)
    this.SET_ALL_COMMENT(data)
  }
}
export const CommentModule = getModule(Comment)
