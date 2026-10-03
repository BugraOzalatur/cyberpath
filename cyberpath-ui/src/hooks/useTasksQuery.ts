import { useQuery } from '@tanstack/react-query'
import { fetchTasks } from '@/api'
import { taskKeys } from '@/constants'
import type { TaskScope } from '@/types'

export const useTasksQuery = (scope: TaskScope, topicId?: number) =>
  useQuery({ queryKey: taskKeys.list(scope, topicId), queryFn: () => fetchTasks(scope, topicId) })
