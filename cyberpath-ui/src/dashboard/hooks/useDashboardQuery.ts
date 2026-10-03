import { useQuery } from '@tanstack/react-query'
import { dashboardKeys } from '@/constants'
import { fetchDashboard } from '../api'

export const useDashboardQuery = () => useQuery({ queryKey: dashboardKeys.all, queryFn: fetchDashboard })
