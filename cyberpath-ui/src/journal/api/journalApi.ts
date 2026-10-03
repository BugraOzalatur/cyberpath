import { http } from '@/modules/axios'
import type { JournalEntry, JournalInput } from '../types'

export const fetchJournal = (from: string, to: string): Promise<JournalEntry[]> =>
  http.get('/journal', { params: { from, to } }).then((res) => res.data)

export const createJournalEntry = (input: JournalInput): Promise<JournalEntry> =>
  http.post('/journal', input).then((res) => res.data)

export const updateJournalEntry = (id: number, input: JournalInput): Promise<JournalEntry> =>
  http.put(`/journal/${id}`, input).then((res) => res.data)

export const deleteJournalEntry = (id: number): Promise<void> => http.delete(`/journal/${id}`).then(() => undefined)
