import { http } from '@/modules/axios'
import type { Question } from '@/types'

export const fetchTopicQuestions = (topicId: number): Promise<Question[]> =>
  http.get(`/topics/${topicId}/questions`).then((res) => res.data)
