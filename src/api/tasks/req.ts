import request from '@/utils/request'
import { IDRFRequestListParameters, IDRFAxiosResponsePromise } from '@/api/types'
import {
  ITaskList, ITaskListAxiosResponsePromise, ITask,
  ITaskAxoisResponsePromise,
  IExtraCommentAxoisResponsePromise,
  IExtraCommentCombinedWithTaskStateChangeLogListAxoisResponsePromise,
  IExtraCommentCombinedWithTaskStateChangeLog,
  IExtraComment,
  ITaskDocumentAttachmentList, ITaskDocumentAttachmentAxoisResponsePromise,
  ITaskDocumentAttachment,
  INewTaskInitialSimpleResponseResultAxoisResponsePromise,
  INewTaskInitialSimpleResponseResult,
  TaskStatePercentReport,
  TaskStatePercentReportAxoisResponsePromise,
  TaskModeReport,
  TaskModeReportAxoisResponsePromise
} from './types'

// ITask
const baseTaskUrl = '/tasks/'

export const getTasks = (params?: IDRFRequestListParameters, url: string = ''): ITaskListAxiosResponsePromise =>
  request.get<ITaskList>(`${baseTaskUrl}${url ? (url + '/') : ''}`, { params })

export const getTask = (id: number): ITaskAxoisResponsePromise =>
  request.get<ITask>(`${baseTaskUrl}${id}/`)

export const addTask = (data: object): ITaskAxoisResponsePromise =>
  request.post<ITask>(baseTaskUrl, data)

export const changeTask = (id: number, data: ITask): ITaskAxoisResponsePromise =>
  request.patch<ITask>(`${baseTaskUrl}${id}/`, data)

export const delTask = (id: number) =>
  request.delete(`${baseTaskUrl}${id}/`)

export const getActiveTaskCount = (): IDRFAxiosResponsePromise<number> =>
  request.get<number>(`${baseTaskUrl}active_task_count/`)

export const finishTask = (id: number) =>
  request.get(`${baseTaskUrl}${id}/finish/`)

export const failTask = (id: number) =>
  request.get(`${baseTaskUrl}${id}/failed/`)

export const remindTask = (id: number) =>
  request.get(`${baseTaskUrl}${id}/remind/`)

export const getNewTaskInitial = (groupId: number, customerId: number): INewTaskInitialSimpleResponseResultAxoisResponsePromise =>
  request.get<INewTaskInitialSimpleResponseResult>(`${baseTaskUrl}new_task_initial/${groupId}/${customerId}/`)

// IExtraComment
const baseCommentUrl = '/tasks/comments/'

export const getCommentsWithLogs = (task: number): IExtraCommentCombinedWithTaskStateChangeLogListAxoisResponsePromise =>
  request.get<IExtraCommentCombinedWithTaskStateChangeLog[]>(`${baseCommentUrl}combine_with_logs/`, { params: { task } })

export const getComment = (id: number): IExtraCommentAxoisResponsePromise =>
  request.get<IExtraComment>(`${baseCommentUrl}${id}/`)

export const addComment = (text: string, taskId: number): IExtraCommentAxoisResponsePromise =>
  request.post<IExtraComment>(baseCommentUrl, {
    text, task: taskId
  })

export const changeComment = (id: number, data: IExtraComment): IExtraCommentAxoisResponsePromise =>
  request.patch<IExtraComment>(`${baseCommentUrl}${id}/`, data)

export const delComment = (id: number) =>
  request.delete(`${baseCommentUrl}${id}/`)

// ITaskDocumentAttachment
const TaskAttachmUrl = '/tasks/attachment/'
export const getAttachments = (task: number): ITaskDocumentAttachmentList =>
  request.get<ITaskDocumentAttachment[]>(TaskAttachmUrl, { params: { task } })

export const getAttachment = (id: number): ITaskDocumentAttachmentAxoisResponsePromise =>
  request.get<ITaskDocumentAttachment>(`${TaskAttachmUrl}${id}/`)

export const addAttachment = (newAtt: any): ITaskDocumentAttachmentAxoisResponsePromise => {
  const formData = new FormData()
  formData.append('doc_file', newAtt.doc_file)
  formData.append('title', newAtt.title)
  formData.append('task', newAtt.task)
  return request.post<ITaskDocumentAttachment>(TaskAttachmUrl, formData)
}

export const delAttachment = (id: number) =>
  request.delete(`${TaskAttachmUrl}${id}/`)

export const taskStatePercentReport = (stateNum: number): TaskStatePercentReportAxoisResponsePromise =>
  request.get<TaskStatePercentReport>(`/tasks/state_percent_report/${stateNum}/`)

export const taskModeReportRequest = (): TaskModeReportAxoisResponsePromise =>
  request.get<TaskModeReport>('/tasks/task_mode_report/')
