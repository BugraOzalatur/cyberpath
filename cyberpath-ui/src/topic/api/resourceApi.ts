import { http } from '@/modules/axios'
import type { ResourceInput, StudyResource } from '../types'

export const fetchResources = (topicId: number): Promise<StudyResource[]> =>
  http.get(`/topics/${topicId}/resources`).then((res) => res.data)

export const createResource = (topicId: number, input: ResourceInput): Promise<StudyResource> =>
  http.post(`/topics/${topicId}/resources`, input).then((res) => res.data)

export const updateResource = (id: number, input: Partial<ResourceInput> & { done?: boolean }): Promise<StudyResource> =>
  http.patch(`/resources/${id}`, input).then((res) => res.data)

export const deleteResource = (id: number): Promise<void> => http.delete(`/resources/${id}`).then(() => undefined)
