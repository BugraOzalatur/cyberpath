import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { journalKeys } from '@/constants'
import { useInvalidateProgress } from '@/hooks'
import { createJournalEntry, deleteJournalEntry, fetchJournal, updateJournalEntry } from '../api'
import type { JournalInput } from '../types'

export const useJournalQuery = (from: string, to: string) =>
  useQuery({ queryKey: [...journalKeys.all, from, to], queryFn: () => fetchJournal(from, to) })

const useInvalidateJournal = () => {
  const queryClient = useQueryClient()
  const invalidateProgress = useInvalidateProgress()
  return () => {
    void queryClient.invalidateQueries({ queryKey: journalKeys.all })
    invalidateProgress()
  }
}

export const useSaveJournalMutation = () => {
  const invalidate = useInvalidateJournal()
  return useMutation({
    mutationFn: ({ id, input }: { id?: number; input: JournalInput }) =>
      id ? updateJournalEntry(id, input) : createJournalEntry(input),
    onSuccess: invalidate,
  })
}

export const useDeleteJournalMutation = () => {
  const invalidate = useInvalidateJournal()
  return useMutation({ mutationFn: deleteJournalEntry, onSuccess: invalidate })
}
