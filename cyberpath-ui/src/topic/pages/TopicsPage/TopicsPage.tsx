import { useMemo, useState } from 'react'
import { Button } from '@/components/Button'
import { ErrorState } from '@/components/ErrorState'
import { Loader } from '@/components/Loader'
import { PageHeader } from '@/components/PageHeader'
import { Tabs } from '@/components/Tabs'
import { CATEGORY_LABELS, CATEGORY_ORDER } from '@/constants'
import { useTopicsQuery } from '@/hooks'
import type { TopicStatus } from '@/types'
import { CreateTopicModal } from '../../components/CreateTopicModal'
import { TopicCard } from '../../components/TopicCard'
import styles from './TopicsPage.module.css'

type Filter = 'ALL' | TopicStatus

export const TopicsPage = () => {
  const { data: topics, isLoading, error } = useTopicsQuery()
  const [filter, setFilter] = useState<Filter>('ALL')
  const [creating, setCreating] = useState(false)

  const groups = useMemo(() => {
    const visible = (topics ?? []).filter((t) => filter === 'ALL' || t.status === filter)
    return CATEGORY_ORDER.map((category) => ({
      category,
      topics: visible.filter((t) => t.category === category),
    })).filter((g) => g.topics.length > 0)
  }, [topics, filter])

  if (isLoading) return <Loader />
  if (error || !topics) return <ErrorState error={error} />

  const count = (status: TopicStatus) => topics.filter((t) => t.status === status).length

  return (
    <>
      <PageHeader
        eyebrow="> roadmap"
        title="Roadmap"
        subtitle="Each topic works like a room: finish its resources, do its tasks, answer its questions and make sure you understand it."
        actions={<Button onClick={() => setCreating(true)}>+ New topic</Button>}
      />
      <div className={styles.toolbar}>
        <Tabs<Filter>
          active={filter}
          onChange={setFilter}
          items={[
            { id: 'ALL', label: 'All', count: topics.length },
            { id: 'IN_PROGRESS', label: 'In progress', count: count('IN_PROGRESS') },
            { id: 'NOT_STARTED', label: 'Not started', count: count('NOT_STARTED') },
            { id: 'COMPLETED', label: 'Completed', count: count('COMPLETED') },
          ]}
        />
      </div>
      {groups.map((group) => (
        <section key={group.category} className={styles.group}>
          <h2 className={styles.groupTitle}>
            <span className={styles.dot} />
            {CATEGORY_LABELS[group.category]}
            <span className={styles.groupCount}>{group.topics.length}</span>
          </h2>
          <div className={styles.grid}>
            {group.topics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </section>
      ))}
      {groups.length === 0 && <p className={styles.empty}>No topics match this filter.</p>}
      <CreateTopicModal open={creating} onClose={() => setCreating(false)} />
    </>
  )
}
