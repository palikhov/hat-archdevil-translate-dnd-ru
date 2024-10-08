// This file is autogenerated, do not edit directly.

import {getApiBase, api} from '../defaults'

import {XliffFile} from '../schemas/XliffFile'
import {Body_create_xliff_xliff__post} from '../schemas/Body_create_xliff_xliff__post'
import {XliffFileWithRecordsCount} from '../schemas/XliffFileWithRecordsCount'
import {StatusMessage} from '../schemas/StatusMessage'
import {XliffFileRecord} from '../schemas/XliffFileRecord'
import {XliffSubstitution} from '../schemas/XliffSubstitution'
import {XliffRecordUpdate} from '../schemas/XliffRecordUpdate'
import {XliffProcessingSettings} from '../schemas/XliffProcessingSettings'

export const getXliffs = async (): Promise<XliffFile[]> => {
  return await api.get<XliffFile[]>(`/xliff/`)
}
export const createXliff = async (data: Body_create_xliff_xliff__post): Promise<XliffFile> => {
  const formData = new FormData()
  formData.append('file', data.file)
  return await api.post<XliffFile>(`/xliff/`, formData)
}
export const getXliff = async (doc_id: number): Promise<XliffFileWithRecordsCount> => {
  return await api.get<XliffFileWithRecordsCount>(`/xliff/${doc_id}`)
}
export const deleteXliff = async (doc_id: number): Promise<StatusMessage> => {
  return await api.delete<StatusMessage>(`/xliff/${doc_id}`)
}
export const getXliffRecords = async (doc_id: number, page?: number | null): Promise<XliffFileRecord[]> => {
  return await api.get<XliffFileRecord[]>(`/xliff/${doc_id}/records`, {query: {page}})
}
export const getSegmentSubstitutions = async (doc_id: number, segment_id: number): Promise<XliffSubstitution[]> => {
  return await api.get<XliffSubstitution[]>(`/xliff/${doc_id}/segments/${segment_id}/substitutions`)
}
export const updateXliffRecord = async (doc_id: number, record_id: number, content: XliffRecordUpdate): Promise<StatusMessage> => {
  return await api.put<StatusMessage>(`/xliff/${doc_id}/record/${record_id}`, content)
}
export const processXliff = async (doc_id: number, content: XliffProcessingSettings): Promise<StatusMessage> => {
  return await api.post<StatusMessage>(`/xliff/${doc_id}/process`, content)
}
export const getDownloadXliffLink = (doc_id: number): string => {
  return getApiBase() + `/xliff/${doc_id}/download`
}
