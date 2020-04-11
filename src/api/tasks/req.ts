import request from '@/utils/request'
import { IDRFRequestListParameters } from '@/api/types'
import { ITaskList, ITaskListAxiosResponsePromise, ITask, ITaskAxoisResponsePromise, IChangeLogList, IChangeLogListAxiosResponsePromise, IChangeLog, IChangeLogAxoisResponsePromise,
  IExtraCommentList, IExtraCommentListAxiosResponsePromise, IExtraCommentAxoisResponsePromise, IExtraComment, IDRFRequestListParametersComment
} from './types'

// ITask
const baseTaskUrl = '/tasks/'

export const getTasks = (params?: IDRFRequestListParameters, url: string = ''): ITaskListAxiosResponsePromise =>
  request.get<ITaskList>(`${baseTaskUrl}${url ? (url + '/') : ''}`, { params })

export const getTask = (id: number): ITaskAxoisResponsePromise =>
  request.get<ITask>(`${baseTaskUrl}${id}/`)

export const addTask = (data: ITask): ITaskAxoisResponsePromise =>
  request.post<ITask>(baseTaskUrl, data)

export const changeTask = (id: number, data: ITask): ITaskAxoisResponsePromise =>
  request.patch<ITask>(`${baseTaskUrl}${id}/`, data)

export const delTask = (id: number) =>
  request.delete(`${baseTaskUrl}${id}/`)

export const getActiveTaskCount = () =>
  request.get(`${baseTaskUrl}active_task_count/`)

export const finishTask = (id: number) =>
  request.get(`${baseTaskUrl}${id}/finish/`)

export const failTask = (id: number) =>
  request.get(`${baseTaskUrl}${id}/failed/`)

export const remindTask = (id: number) =>
  request.get(`${baseTaskUrl}${id}/remind/`)

// IChangeLog
const baseTaskLogUrl = '/tasks/log/'
export const getChangeLogs = (params: IDRFRequestListParameters): IChangeLogListAxiosResponsePromise =>
  request.get<IChangeLogList>(baseTaskLogUrl, { params })

export const getChangeLog = (id: number): IChangeLogAxoisResponsePromise =>
  request.get<IChangeLog>(`${baseTaskLogUrl}${id}/`)

export const addChangeLog = (dat: IChangeLog): IChangeLogAxoisResponsePromise =>
  request.post<IChangeLog>(baseTaskLogUrl, dat)

export const changeChangeLog = (id: number, newData: IChangeLog): IChangeLogAxoisResponsePromise =>
  request.patch<IChangeLog>(`${baseTaskLogUrl}${id}/`, newData)

export const delChangeLog = (id: number) =>
  request.delete(`${baseTaskLogUrl}${id}/`)

// IExtraComment
const baseCommentUrl = '/tasks/comments/'
export const getComments = (params: IDRFRequestListParametersComment): IExtraCommentListAxiosResponsePromise =>
  request.get<IExtraCommentList>(baseCommentUrl, { params })

export const getComment = (id: number): IExtraCommentAxoisResponsePromise =>
  request.get<IExtraComment>(`${baseCommentUrl}${id}/`)

export const addComment = (data: IExtraComment): IExtraCommentAxoisResponsePromise =>
  request.post<IExtraComment>(baseCommentUrl, data)

export const changeComment = (id: number, data: IExtraComment): IExtraCommentAxoisResponsePromise =>
  request.patch<IExtraComment>(`${baseCommentUrl}${id}/`, data)

export const delComment = (id: number) =>
  request.delete(`${baseCommentUrl}${id}/`)
