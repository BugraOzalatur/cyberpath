import type { TaskScope } from '@/types'

export const topicKeys = {
  all: ['topics'] as const,
  detail: (id: number) => ['topics', id] as const,
  resources: (id: number) => ['topics', id, 'resources'] as const,
  questions: (id: number) => ['topics', id, 'questions'] as const,
}

export const taskKeys = {
  all: ['tasks'] as const,
  list: (scope: TaskScope, topicId?: number) => ['tasks', scope, topicId ?? 'any'] as const,
}

export const dashboardKeys = {
  all: ['dashboard'] as const,
}

export const journalKeys = {
  all: ['journal'] as const,
}
