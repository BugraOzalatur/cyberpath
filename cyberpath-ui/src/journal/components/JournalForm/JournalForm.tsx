import { useState, type FormEvent } from 'react'
import { Button } from '@/components/Button'
import { Input, Select, Textarea } from '@/components/Field'
import { useTopicsQuery } from '@/hooks'
import { errorMessage } from '@/modules/axios'
import { cn } from '@/utils/cn'
import { todayIso } from '@/utils/date'
import { useSaveJournalMutation } from '../../hooks/useJournal'
import type { JournalEntry } from '../../types'
import styles from './JournalForm.module.css'

const QUICK_MINUTES = [15, 30, 45, 60, 90, 120]

export interface JournalFormProps {
  editing: JournalEntry | null
  onDone: () => void
}

export const JournalForm = ({ editing, onDone }: JournalFormProps) => {
  const { data: topics } = useTopicsQuery()
  const save = useSaveJournalMutation()
  // The parent remounts this component via `key` when the edited entry changes
  const [entryDate, setEntryDate] = useState(editing?.entryDate ?? todayIso())
  const [minutes, setMinutes] = useState(editing?.minutes ?? 30)
  const [topicId, setTopicId] = useState(editing?.topicId ? String(editing.topicId) : '')
  const [summary, setSummary] = useState(editing?.summary ?? '')
  const [struggles, setStruggles] = useState(editing?.struggles ?? '')
  const [nextGoal, setNextGoal] = useState(editing?.nextGoal ?? '')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    save.mutate(
      {
        id: editing?.id,
        input: {
          entryDate,
          minutes,
          summary: summary.trim(),
          struggles: struggles.trim() || undefined,
          nextGoal: nextGoal.trim() || undefined,
          topicId: topicId ? Number(topicId) : null,
        },
      },
      {
        onSuccess: () => {
          setSummary('')
          setStruggles('')
          setNextGoal('')
          onDone()
        },
      },
    )
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.row}>
        <Input label="Date" type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} required />
        <Input label="Duration (min)" type="number" min={0} max={1440} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} />
      </div>
      <div className={styles.chips}>
        {QUICK_MINUTES.map((m) => (
          <button type="button" key={m} className={cn(styles.chip, minutes === m && styles.chipActive)} onClick={() => setMinutes(m)}>
            {m} min
          </button>
        ))}
      </div>
      <Select label="Topic" value={topicId} onChange={(e) => setTopicId(e.target.value)}>
        <option value="">— General —</option>
        {topics?.map((t) => (
          <option key={t.id} value={t.id}>{t.title}</option>
        ))}
      </Select>
      <Textarea label="What did I learn today?" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Briefly, in your own words." required />
      <Textarea label="Where did I struggle?" value={struggles} onChange={(e) => setStruggles(e.target.value)} placeholder="Write down what was unclear, then ask Claude." />
      <Input label="Next goal" value={nextGoal} onChange={(e) => setNextGoal(e.target.value)} placeholder="e.g. Bandit 6-10" />
      {save.isError && <p className={styles.error}>{errorMessage(save.error)}</p>}
      <div className={styles.actions}>
        {editing && <Button variant="ghost" onClick={onDone}>Cancel</Button>}
        <Button type="submit" disabled={!summary.trim() || save.isPending}>{editing ? 'Update' : 'Save'}</Button>
      </div>
    </form>
  )
}
