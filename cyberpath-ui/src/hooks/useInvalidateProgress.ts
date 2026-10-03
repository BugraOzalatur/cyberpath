import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { dashboardKeys, taskKeys, topicKeys } from '@/constants'

/** Refreshes topic, task and dashboard data after any change that affects progress. */
export const useInvalidateProgress = () => {
  const queryClient = useQueryClient()
  return useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: topicKeys.all })
    void queryClient.invalidateQueries({ queryKey: taskKeys.all })
    void queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
  }, [queryClient])
}
