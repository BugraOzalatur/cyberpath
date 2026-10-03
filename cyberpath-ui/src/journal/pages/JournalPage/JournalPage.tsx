import { useMemo, useState } from 'react'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { Loader } from '@/components/Loader'
import { PageHeader } from '@/components/PageHeader'
import { useTopicsQuery } from '@/hooks'
import { addDays, formatDay, formatLongDay, formatMinutes, todayIso } from '@/utils/date'
import { JournalForm } from '../../components/JournalForm'
import { useDeleteJournalMutation, useJournalQuery } from '../../hooks/useJournal'
import type { JournalEntry } from '../../types'
import styles from './JournalPage.module.css'

const RANGE_DAYS = 90

const weekStartOf = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  const weekday = (new Date(y, m - 1, d).getDay() + 6) % 7
  return addDays(iso, -weekday)
}

export const JournalPage = () => {
  const today = todayIso()
  const { data: entries, isLoading, error } = useJournalQuery(addDays(today, -RANGE_DAYS), today)
  const { data: topics } = useTopicsQuery()
  const remove = useDeleteJournalMutation()
  const [editing, setEditing] = useState<JournalEntry | null>(null)

  const topicTitles = useMemo(() => new Map((topics ?? []).map((t) => [t.id, t.title])), [topics])
  const weeks = useMemo(() => {
    const groups = new Map<string, JournalEntry[]>()
    for (const entry of entries ?? []) {
      const key = weekStartOf(entry.entryDate)
      groups.set(key, [...(groups.get(key) ?? []), entry])
    }
    return [...groups.entries()].map(([weekStart, items]) => ({
      weekStart,
      items,
      minutes: items.reduce((sum, e) => sum + e.minutes, 0),
      days: new Set(items.map((e) => e.entryDate)).size,
    }))
  }, [entries])

  return (
    <>
      <PageHeader eyebrow="> log" title="Study Journal" subtitle="A few lines a day: what you learned, where you struggled, what comes next. Weekly summaries are built automatically." />
      <div className={styles.layout}>
        <Card title={editing ? 'Edit entry' : 'Today’s entry'} className={styles.formCard}>
          <JournalForm key={editing?.id ?? 'new'} editing={editing} onDone={() => setEditing(null)} />
        </Card>

        <div className={styles.timeline}>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <ErrorState error={error} />
          ) : weeks.length === 0 ? (
            <Card>
              <EmptyState icon="✎" title="No entries yet" description="Add your first entry on the left. Writing regularly makes learning stick." />
            </Card>
          ) : (
            weeks.map((week) => (
              <section key={week.weekStart} className={styles.week}>
                <header className={styles.weekHeader}>
                  <h2>{formatDay(week.weekStart)} – {formatDay(addDays(week.weekStart, 6))}</h2>
                  <div className={styles.weekStats}>
                    <Badge tone="info">⏱ {formatMinutes(week.minutes)}</Badge>
                    <Badge tone="accent">{week.days}/7 days</Badge>
                  </div>
                </header>
                {week.items.map((entry) => (
                  <article key={entry.id} className={styles.entry}>
                    <div className={styles.entryTop}>
                      <span className={styles.date}>{formatLongDay(entry.entryDate)}</span>
                      <span className={styles.minutes}>{formatMinutes(entry.minutes)}</span>
                      {entry.topicId && <Badge tone="violet">{topicTitles.get(entry.topicId)}</Badge>}
                      <div className={styles.entryActions}>
                        <Button size="sm" variant="ghost" onClick={() => setEditing(entry)}>Edit</Button>
                        <Button size="sm" variant="danger" onClick={() => remove.mutate(entry.id)} aria-label="Sil">×</Button>
                      </div>
                    </div>
                    <p className={styles.summary}>{entry.summary}</p>
                    {entry.struggles && <p className={styles.struggles}><strong>Struggled with:</strong> {entry.struggles}</p>}
                    {entry.nextGoal && <p className={styles.next}><strong>Next:</strong> {entry.nextGoal}</p>}
                  </article>
                ))}
              </section>
            ))
          )}
        </div>
      </div>
    </>
  )
}
