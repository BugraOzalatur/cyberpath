import { http } from '@/modules/axios'
import type { CreateTopicInput, Topic, UpdateTopicInput } from '@/types'

export const fetchTopics = (): Promise<Topic[]> => http.get('/topics').then((res) => res.data)

export const fetchTopic = (id: number): Promise<Topic> => http.get(`/topics/${id}`).then((res) => res.data)

export const createTopic = (input: CreateTopicInput): Promise<Topic> =>
  http.post('/topics', input).then((res) => res.data)

export const updateTopic = (id: number, input: UpdateTopicInput): Promise<Topic> =>
  http.patch(`/topics/${id}`, input).then((res) => res.data)

export const deleteTopic = (id: number): Promise<void> => http.delete(`/topics/${id}`).then(() => undefined)
