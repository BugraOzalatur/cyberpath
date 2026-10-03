import { useMutation } from '@tanstack/react-query'
import { fetchExam } from '@/api'

/** A mutation instead of a query: every start fetches a new random question set. */
export const useStartExamMutation = () =>
  useMutation({ mutationFn: ({ topicIds, size }: { topicIds: number[]; size: number }) => fetchExam(topicIds, size) })
