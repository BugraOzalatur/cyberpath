export type ResourceKind = 'COURSE' | 'VIDEO' | 'LAB' | 'DOC' | 'BOOK'

export interface StudyResource {
  id: number
  topicId: number
  title: string
  url: string | null
  kind: ResourceKind
  done: boolean
}

export interface ResourceInput {
  title: string
  url?: string
  kind: ResourceKind
}
