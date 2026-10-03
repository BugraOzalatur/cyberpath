import type { ResourceKind } from './types'

export const RESOURCE_KIND_LABELS: Record<ResourceKind, string> = {
  COURSE: 'Course',
  VIDEO: 'Video',
  LAB: 'Lab',
  DOC: 'Docs',
  BOOK: 'Book',
}

export const RESOURCE_KIND_ICONS: Record<ResourceKind, string> = {
  COURSE: '▣',
  VIDEO: '▶',
  LAB: '⌘',
  DOC: '❏',
  BOOK: '❐',
}
