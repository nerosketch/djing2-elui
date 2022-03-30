/* eslint-disable camelcase */
import { IDRFAxiosResponsePromise, IDRFListResponse, ISimpleResponseResult } from '@/api/types'

export enum ITaskPriority {
  LOW = 0,
  AWARAGE = 1,
  HIGHER = 2
}

export enum ITaskState {
  NEW = 0,
  CONFUSED = 1,
  COMPLETED = 2
}

export interface ITask {
  id: number
  author_full_name?: string
  author_uname?: string
  priority_name?: string
  time_diff?: string
  customer_address?: string
  customer_full_name?: string
  customer_uname?: string
  customer_group?: number
  comment_count?: number
  recipients: number[]
  state_str?: string
  mode_str?: string
  time_of_create?: string
  descr: string
  priority: ITaskPriority
  out_date: string
  task_state: ITaskState
  task_mode: number | null
  author: number
  customer?: number
  is_expired?: boolean
  activeTaskCount?: number
}
export type ITaskList = IDRFListResponse<ITask>
export type ITaskListAxiosResponsePromise = IDRFAxiosResponsePromise<ITaskList>

type IExtraCommentChangeLogType = 'comment' | 'log'

export interface IExtraComment {
  id: number
  author_id: number
  author_name?: string
  author_avatar?: string
  text: string
  date_create: string
  task: number
  can_remove?: boolean
  type?: IExtraCommentChangeLogType
}
export type IExtraCommentAxoisResponsePromise = IDRFAxiosResponsePromise<IExtraComment>

export interface IExtraCommentChangeLog {
  readonly id: number
  who: number
  readonly who_name: string
  // who_avatar: string
  when: string
  human_representation: string
  readonly type: IExtraCommentChangeLogType
}
export type IExtraCommentCombinedWithTaskStateChangeLog = IExtraComment | IExtraCommentChangeLog
export type IExtraCommentCombinedWithTaskStateChangeLogListAxoisResponsePromise = IDRFAxiosResponsePromise<IExtraCommentCombinedWithTaskStateChangeLog[]>

export interface ITaskDocumentAttachment {
  id: number
  title: string
  doc_file: string
  create_time: string
  author: number
  task: number
}
export type ITaskDocumentAttachmentList = IDRFAxiosResponsePromise<ITaskDocumentAttachment[]>
export type ITaskDocumentAttachmentAxoisResponsePromise = IDRFAxiosResponsePromise<ITaskDocumentAttachment>

export interface INewTaskInitialSimpleResponseResult extends ISimpleResponseResult {
  recipients?: number[]
  task_id?: number
}
export type INewTaskInitialSimpleResponseResultAxoisResponsePromise = IDRFAxiosResponsePromise<INewTaskInitialSimpleResponseResult>

export interface TaskStatePercentReportTypeCount {
  mode: string
  task_count: number
}
export interface TaskModeReport {
  // all_task_count: number
  annotation: TaskStatePercentReportTypeCount[]
}
export type TaskModeReportAxoisResponsePromise = IDRFAxiosResponsePromise<TaskModeReport>

export interface TaskStatePercentReport {
  state_count: number
  state_percent: number
}
export type TaskStatePercentReportAxoisResponsePromise = IDRFAxiosResponsePromise<TaskStatePercentReport>

export interface ITaskMode {
  id: number
  title: string
}
export type ITaskModeList = IDRFAxiosResponsePromise<ITaskMode[]>

export interface ITaskFinishDocument {
  id: number
  code: string
  // act_num: string | null
  author: number
  task: number
  create_time: string
  finish_time: string
  cost: number
  task_mode: number
  recipients: number[]
}
