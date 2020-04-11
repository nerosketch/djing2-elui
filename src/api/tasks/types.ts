import { IDRFAxiosResponsePromise, IDRFListResponse, IDRFRequestListParameters } from '../types'

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

export enum ITaskType {
  NOT_CHOSEN = 0,
  IP_CONFLICT = 1,
  YELLOW_TRIANGLE = 2,
  RED_CROSS = 3,
  WEAK_SPEED = 4,
  CABLE_BREAK = 5,
  CONNECTION = 6,
  PERIODIC_DISAPPEARANCE = 7,
  ROUTER_SETUP = 8,
  CONFIGURE_ONU = 9,
  CRIMP_CABLE = 10,
  INTERNET_CRASH = 11,
  OTHER = 12
}

export enum IChangeLogAct {
  CHANGE_TASK = 1,
  CREATE_TASK = 2,
  DELETE_TASK = 3,
  COMPLETING_TASK = 4,
  FAILED_TASK = 5
}

export interface IChangeLog {
  id: number
  task: number
  act_type: IChangeLogAct
  when: string,
  who: number
}
export type IChangeLogList = IDRFListResponse<IChangeLog>
export type IChangeLogAxoisResponsePromise = IDRFAxiosResponsePromise<IChangeLog>
export type IChangeLogListAxiosResponsePromise = IDRFAxiosResponsePromise<IChangeLogList>

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
  state: ITaskState
  mode: ITaskType
  author: number
  customer: number
  is_expired?: boolean
}
export type ITaskList = IDRFListResponse<ITask>
export type ITaskAxoisResponsePromise = IDRFAxiosResponsePromise<ITask>
export type ITaskListAxiosResponsePromise = IDRFAxiosResponsePromise<ITaskList>

export interface IExtraComment {
  id: number
  author_id: number
  author_name?: string
  author_avatar?: string
  text: string
  date_create: string
  task: number
}
export type IExtraCommentList = IDRFListResponse<IExtraComment>
export type IExtraCommentAxoisResponsePromise = IDRFAxiosResponsePromise<IExtraComment>
export type IExtraCommentListAxiosResponsePromise = IDRFAxiosResponsePromise<IExtraCommentList>

export interface IDRFRequestListParametersComment extends IDRFRequestListParameters {
  act_type?: number
  who?: number
  task?: number
}
