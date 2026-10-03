import { useMutation, useQuery } from '@tanstack/react-query'
import { topicKeys } from '@/constants'
import { useInvalidateProgress } from '@/hooks'
import { createResource, deleteResource, fetchResources, updateResource } from '../api'
import type { ResourceInput } from '../types'

export const useResourcesQuery = (topicId: number) =>
  useQuery({ queryKey: topicKeys.resources(topicId), queryFn: () => fetchResources(topicId) })

export const useCreateResourceMutation = (topicId: number) => {
  const invalidate = useInvalidateProgress()
  return useMutation({ mutationFn: (input: ResourceInput) => createResource(topicId, input), onSuccess: invalidate })
}

export const useToggleResourceMutation = () => {
  const invalidate = useInvalidateProgress()
  return useMutation({
    mutationFn: ({ id, done }: { id: number; done: boolean }) => updateResource(id, { done }),
    onSuccess: invalidate,
  })
}

export const useDeleteResourceMutation = () => {
  const invalidate = useInvalidateProgress()
  return useMutation({ mutationFn: deleteResource, onSuccess: invalidate })
}
