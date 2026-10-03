export type TaskScope = 'TODAY' | 'WEEK' | 'ALL'

export interface Task {
  id: number
  topicId: number | null
  title: string
  dueDate: string | null
  done: boolean
  doneAt: string | null
  overdue: boolean
}

export interface CreateTaskInput {
  title: string
  topicId?: number | null
  dueDate?: string | null
}

export interface UpdateTaskInput {
  title?: string
  topicId?: number
  dueDate?: string
  clearDueDate?: boolean
  done?: boolean
}
