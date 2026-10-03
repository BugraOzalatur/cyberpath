import { http } from '@/modules/axios'
import type { CreateTaskInput, Task, TaskScope, UpdateTaskInput } from '@/types'

export const fetchTasks = (scope: TaskScope, topicId?: number): Promise<Task[]> =>
  http.get('/tasks', { params: { scope, topicId } }).then((res) => res.data)

export const createTask = (input: CreateTaskInput): Promise<Task> => http.post('/tasks', input).then((res) => res.data)

export const updateTask = (id: number, input: UpdateTaskInput): Promise<Task> =>
  http.patch(`/tasks/${id}`, input).then((res) => res.data)

export const deleteTask = (id: number): Promise<void> => http.delete(`/tasks/${id}`).then(() => undefined)
