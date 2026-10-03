export type TopicCategory = 'FUNDAMENTALS' | 'NETWORK' | 'CRYPTO' | 'WEB' | 'DEFENSE' | 'CLOUD' | 'PRACTICE'
export type TopicStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'

export interface TopicProgress {
  resourcesDone: number
  resourcesTotal: number
  questionsPassed: number
  questionsTotal: number
  pendingReviews: number
  openTasks: number
  mastery: number | null
  percent: number
  needsReview: boolean
}

export interface Topic {
  id: number
  slug: string
  title: string
  category: TopicCategory
  summary: string | null
  orderIndex: number
  status: TopicStatus
  understanding: number | null
  notes: string | null
  startedAt: string | null
  completedAt: string | null
  progress: TopicProgress
}

export interface CreateTopicInput {
  title: string
  category: TopicCategory
  summary?: string
}

export interface UpdateTopicInput {
  title?: string
  category?: TopicCategory
  summary?: string
  status?: TopicStatus
  understanding?: number
  notes?: string
}
