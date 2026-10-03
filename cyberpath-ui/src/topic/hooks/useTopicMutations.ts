import { useMutation } from '@tanstack/react-query'
import { createTopic, updateTopic } from '@/api'
import { useInvalidateProgress } from '@/hooks'
import type { UpdateTopicInput } from '@/types'

export const useCreateTopicMutation = () => {
  const invalidate = useInvalidateProgress()
  return useMutation({ mutationFn: createTopic, onSuccess: invalidate })
}

export const useUpdateTopicMutation = (id: number) => {
  const invalidate = useInvalidateProgress()
  return useMutation({ mutationFn: (input: UpdateTopicInput) => updateTopic(id, input), onSuccess: invalidate })
}
