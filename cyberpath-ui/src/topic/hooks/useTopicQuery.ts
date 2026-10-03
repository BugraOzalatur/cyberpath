import { useQuery } from '@tanstack/react-query'
import { fetchTopic } from '@/api'
import { topicKeys } from '@/constants'

export const useTopicQuery = (id: number) => useQuery({ queryKey: topicKeys.detail(id), queryFn: () => fetchTopic(id) })
