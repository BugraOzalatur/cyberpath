import { http } from '@/modules/axios'
import type { Dashboard } from '../types'

export const fetchDashboard = (): Promise<Dashboard> => http.get('/dashboard').then((res) => res.data)
