import { useQuery } from '@tanstack/react-query'
import { topicKeys } from '@/constants'
import { fetchTopicQuestions } from '../api'

export const useTopicQuestionsQuery = (topicId: number) =>
  useQuery({ queryKey: topicKeys.questions(topicId), queryFn: () => fetchTopicQuestions(topicId) })
