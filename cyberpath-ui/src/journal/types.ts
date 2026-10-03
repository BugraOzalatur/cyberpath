export interface JournalEntry {
  id: number
  entryDate: string
  minutes: number
  summary: string
  struggles: string | null
  nextGoal: string | null
  topicId: number | null
}

export interface JournalInput {
  entryDate: string
  minutes: number
  summary: string
  struggles?: string
  nextGoal?: string
  topicId?: number | null
}
