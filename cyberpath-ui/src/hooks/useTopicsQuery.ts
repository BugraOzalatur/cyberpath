import { useQuery } from '@tanstack/react-query'
import { fetchTopics } from '@/api'
import { topicKeys } from '@/constants'

export const useTopicsQuery = () => useQuery({ queryKey: topicKeys.all, queryFn: fetchTopics })
