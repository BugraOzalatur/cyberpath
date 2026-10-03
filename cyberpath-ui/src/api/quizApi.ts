import { http } from '@/modules/axios'
import type { AnswerInput, AnswerResult, Question } from '@/types'

export const fetchExam = (topicIds: number[], size: number): Promise<Question[]> =>
  http
    .get('/quiz/exam', { params: { size, topicIds: topicIds.length ? topicIds.join(',') : undefined } })
    .then((res) => res.data)

export const answerQuestion = (questionId: number, input: AnswerInput): Promise<AnswerResult> =>
  http.post(`/questions/${questionId}/attempts`, input).then((res) => res.data)
