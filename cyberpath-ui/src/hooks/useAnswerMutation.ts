import { useMutation } from '@tanstack/react-query'
import { answerQuestion } from '@/api'
import type { AnswerInput } from '@/types'
import { useInvalidateProgress } from './useInvalidateProgress'

export const useAnswerMutation = () => {
  const invalidate = useInvalidateProgress()
  return useMutation({
    mutationFn: ({ questionId, input }: { questionId: number; input: AnswerInput }) =>
      answerQuestion(questionId, input),
    onSuccess: invalidate,
  })
}
