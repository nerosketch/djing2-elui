import request from '@/utils/request'
import {
  IDRFAxiosResponsePromise,
  IDRFListResponse,
  IDRFRequestListParameters
} from "@/api/types"

// Crud operations decorators

export function getObjectListDecorator<T>(baseUrl: string) {
  return (params?: IDRFRequestListParameters): IDRFAxiosResponsePromise<IDRFListResponse<T>> => request.get<IDRFListResponse<T>>(baseUrl, { params })
}
export function getObjectDecorator<T>(baseUrl: string) {
  return (uid: number): IDRFAxiosResponsePromise<T> => request.get<T>(`${baseUrl}${uid}/`)
}
export function addObjectDecorator<T>(baseUrl: string) {
  return (info: object): IDRFAxiosResponsePromise<T> => request.post<T>(baseUrl, info)
}
export function delObjectDecorator<T>(baseUrl: string) {
  return (uid: number) => request.delete<T>(`${baseUrl}${uid}/`)
}
export function patchObjectDecorator<T>(baseUrl: string) {
  return (uid: number, info: object): IDRFAxiosResponsePromise<T> => request.patch<T>(`${baseUrl}${uid}/`, info)
}
export function updateObjectDecorator<T>(baseUrl: string) {
  return (uid: number, info: object): IDRFAxiosResponsePromise<T> => request.put<T>(`${baseUrl}${uid}/`, info)
}
