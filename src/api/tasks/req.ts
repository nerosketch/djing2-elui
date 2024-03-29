import request from '@/utils/request'
import { IDRFRequestListParameters, IDRFAxiosResponsePromise } from '@/api/types'
import {
  ITaskList, ITaskListAxiosResponsePromise, ITask,
  IExtraCommentAxoisResponsePromise,
  IExtraCommentCombinedWithTaskStateChangeLogListAxoisResponsePromise,
  IExtraCommentCombinedWithTaskStateChangeLog,
  IExtraComment,
  ITaskDocumentAttachmentAxoisResponsePromise,
  ITaskDocumentAttachment,
  INewTaskInitialSimpleResponseResultAxoisResponsePromise,
  INewTaskInitialSimpleResponseResult,
  TaskStatePercentReport,
  TaskStatePercentReportAxoisResponsePromise,
  TaskModeReport,
  TaskModeReportAxoisResponsePromise,
  ITaskMode,
  ITaskFinishDocument,
  ITaskDocumentAttachmentAxiosList,
  ITaskDocumentAttachmentList,
  ITaskFinishDocumentList,
} from './types'
import {
  addObjectDecorator,
  delObjectDecorator,
  getObjectDecorator,
  getObjectListDecorator,
  patchObjectDecorator
} from '@/api/baseRequests'

// ITask
const baseTaskUrl = '/tasks/'
export const getTasks = (params?: IDRFRequestListParameters, url: string = ''): ITaskListAxiosResponsePromise =>
  request.get<ITaskList>(`${baseTaskUrl}${url ? (url + '/') : ''}`, { params })

export const getTask = getObjectDecorator<ITask>(baseTaskUrl)
export const addTask = addObjectDecorator<ITask>(baseTaskUrl)
export const changeTask = patchObjectDecorator<ITask>(baseTaskUrl)
export const delTask = delObjectDecorator<ITask>(baseTaskUrl)

export const getActiveTaskCount = (): IDRFAxiosResponsePromise<number> =>
  request.get<number>(`${baseTaskUrl}active_task_count/`)

export const finishTask = (id: number) =>
  request.get(`${baseTaskUrl}${id}/finish/`)

export const failTask = (id: number) =>
  request.get(`${baseTaskUrl}${id}/fail/`)

export const remindTask = (id: number) =>
  request.get(`${baseTaskUrl}${id}/remind/`)

export const getNewTaskInitial = (groupId: number, customerId: number): INewTaskInitialSimpleResponseResultAxoisResponsePromise =>
  request.get<INewTaskInitialSimpleResponseResult>(`${baseTaskUrl}new_task_initial/${groupId}/${customerId}/`)

// IExtraComment
const baseCommentUrl = '/tasks/comments/'

export const getCommentsWithLogs = (task_id: number): IExtraCommentCombinedWithTaskStateChangeLogListAxoisResponsePromise =>
  request.get<IExtraCommentCombinedWithTaskStateChangeLog[]>(`${baseCommentUrl}combine_with_logs/`, { params: { task_id } })

export const getComment = getObjectDecorator<IExtraComment>(baseCommentUrl)

export const addComment = (text: string, taskId: number): IExtraCommentAxoisResponsePromise =>
  request.post<IExtraComment>(baseCommentUrl, {
    text, task_id: taskId
  })

export const changeComment = patchObjectDecorator<IExtraComment>(baseCommentUrl)
export const delComment = delObjectDecorator<IExtraComment>(baseCommentUrl)

// ITaskDocumentAttachment
const TaskAttachmUrl = '/tasks/attachment/'
export const getAttachments = (task_id: number): ITaskDocumentAttachmentAxiosList =>
  request.get<ITaskDocumentAttachmentList>(TaskAttachmUrl, { params: { task_id } })

export const getAttachment = getObjectDecorator<ITaskDocumentAttachment>(TaskAttachmUrl)

export const addAttachment = (newAtt: any): ITaskDocumentAttachmentAxoisResponsePromise => {
  const formData = new FormData()
  formData.append('doc_file', newAtt.doc_file)
  formData.append('title', newAtt.title)
  formData.append('task_id', newAtt.task_id)
  return request.post<ITaskDocumentAttachment>(TaskAttachmUrl, formData)
}

export const delAttachment = delObjectDecorator<ITaskDocumentAttachment>(TaskAttachmUrl)

export const taskStatePercentReport = (stateNum: number): TaskStatePercentReportAxoisResponsePromise =>
  request.get<TaskStatePercentReport>(`/tasks/state_percent_report/${stateNum}/`)

export const taskModeReportRequest = (): TaskModeReportAxoisResponsePromise =>
  request.get<TaskModeReport>('/tasks/task_mode_report/')

const modeBaseUrl = '/tasks/modes/'
export const getMode = getObjectDecorator<ITaskMode>(modeBaseUrl)
export const getModes = getObjectListDecorator<ITaskMode>(modeBaseUrl)
export const addMode = addObjectDecorator<ITaskMode>(modeBaseUrl)
export const changeMode = patchObjectDecorator<ITaskMode>(modeBaseUrl)
// export const delMode = delObjectDecorator<ITaskMode>(modeBaseUrl)

const taskFinishDocBaseUrl = '/tasks/finish_document/'
export const getTaskFinishDoc = async(taskId: number): Promise<ITaskFinishDocument | null> => {
  const r = await request.get<ITaskFinishDocumentList>(taskFinishDocBaseUrl, {
    params: { task_id: taskId }
  })
  if (r.status === 200 && r.data.results.length > 0) {
    return r.data.results[0]
  }
  return null
}
// export const getTaskFinishDocs = getObjectListDecorator<ITaskFinishDocument>(taskFinishDocBaseUrl)
export const addTaskFinishDoc = addObjectDecorator<ITaskFinishDocument>(taskFinishDocBaseUrl)
export const changeTaskFinishDoc = patchObjectDecorator<ITaskFinishDocument>(taskFinishDocBaseUrl)
