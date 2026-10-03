export type QuestionKind = 'MULTIPLE_CHOICE' | 'OPEN'
export type QuestionSource = 'SEED' | 'MANUAL' | 'CLAUDE'

export interface LastAttempt {
  id: number
  selectedIndex: number | null
  answerText: string | null
  correct: boolean | null
  pending: boolean
  feedback: string | null
  createdAt: string
}

export interface Question {
  id: number
  topicId: number
  prompt: string
  kind: QuestionKind
  options: string[]
  source: QuestionSource
  lastAttempt: LastAttempt | null
  correctIndex: number | null
  explanation: string | null
}

export interface AnswerInput {
  selectedIndex?: number
  answerText?: string
}

export interface AnswerResult {
  attemptId: number
  correct: boolean | null
  pending: boolean
  correctIndex: number | null
  explanation: string | null
}
