import type { TopicCategory, TopicStatus } from '@/types'

export const CATEGORY_LABELS: Record<TopicCategory, string> = {
  FUNDAMENTALS: 'Fundamentals',
  NETWORK: 'Networking',
  CRYPTO: 'Cryptography',
  WEB: 'Web Security',
  DEFENSE: 'Defense',
  CLOUD: 'Cloud',
  PRACTICE: 'Practice',
}

export const CATEGORY_ORDER: TopicCategory[] = ['FUNDAMENTALS', 'NETWORK', 'CRYPTO', 'WEB', 'DEFENSE', 'CLOUD', 'PRACTICE']

export const STATUS_LABELS: Record<TopicStatus, string> = {
  NOT_STARTED: 'Not started',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
}

export const UNDERSTANDING_LABELS = ['', 'Not at all', 'A little', 'Somewhat', 'Well', 'Very well — I could teach it']
