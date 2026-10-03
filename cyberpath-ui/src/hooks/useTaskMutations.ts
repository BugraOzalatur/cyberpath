import { useMutation } from '@tanstack/react-query'
import { createTask, deleteTask, updateTask } from '@/api'
import type { UpdateTaskInput } from '@/types'
import { useInvalidateProgress } from './useInvalidateProgress'

export const useCreateTaskMutation = () => {
  const invalidate = useInvalidateProgress()
  return useMutation({ mutationFn: createTask, onSuccess: invalidate })
}

export const useUpdateTaskMutation = () => {
  const invalidate = useInvalidateProgress()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateTaskInput }) => updateTask(id, input),
    onSuccess: invalidate,
  })
}

export const useDeleteTaskMutation = () => {
  const invalidate = useInvalidateProgress()
  return useMutation({ mutationFn: deleteTask, onSuccess: invalidate })
}
