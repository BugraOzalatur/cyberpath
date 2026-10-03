import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { Badge } from '@/components/Badge'
import { Card } from '@/components/Card'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { Loader } from '@/components/Loader'
import { ProgressRing } from '@/components/ProgressRing'
import { QuestionCard } from '@/components/QuestionCard'
import { Tabs } from '@/components/Tabs'
import { CATEGORY_LABELS } from '@/constants'
import { ResourceList } from '../../components/ResourceList'
import { StatusSwitch } from '../../components/StatusSwitch'
import { TopicNotes } from '../../components/TopicNotes'
import { TopicTaskList } from '../../components/TopicTaskList'
import { UnderstandingRating } from '../../components/UnderstandingRating'
import { useUpdateTopicMutation } from '../../hooks/useTopicMutations'
import { useTopicQuery } from '../../hooks/useTopicQuery'
import { useTopicQuestionsQuery } from '../../hooks/useTopicQuestionsQuery'
import styles from './TopicDetailPage.module.css'

type Section = 'resources' | 'tasks' | 'questions' | 'notes'

export const TopicDetailPage = () => {
  const topicId = Number(useParams().topicId)
  const { data: topic, isLoading, error } = useTopicQuery(topicId)
  const { data: questions } = useTopicQuestionsQuery(topicId)
  const update = useUpdateTopicMutation(topicId)
  const [section, setSection] = useState<Section>('resources')

  if (isLoading) return <Loader />
  if (error || !topic) return <ErrorState error={error} />

  const p = topic.progress

  return (
    <>
      <Link to="/topics" className={styles.back}>← Roadmap</Link>
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <div className={styles.badges}>
            <Badge tone="info">{CATEGORY_LABELS[topic.category]}</Badge>
            <span className={styles.order}>#{String(topic.orderIndex).padStart(2, '0')}</span>
          </div>
          <h1>{topic.title}</h1>
          {topic.summary && <p className={styles.summary}>{topic.summary}</p>}
        </div>
        <StatusSwitch value={topic.status} disabled={update.isPending} onChange={(status) => update.mutate({ status })} />
      </header>

      {p.needsReview && (
        <div className={styles.warning}>
          <strong>⚠ You may need to review this topic.</strong> You marked it as completed, but your quiz score is {p.mastery ?? 0}%
          {topic.understanding !== null && <> and your self-assessment is {topic.understanding}/5</>}. Retry the questions you missed or ask Claude for new questions on this topic.
        </div>
      )}

      <div className={styles.layout}>
        <div className={styles.main}>
          <Tabs<Section>
            active={section}
            onChange={setSection}
            items={[
              { id: 'resources', label: 'Resources', count: p.resourcesTotal },
              { id: 'tasks', label: 'Tasks', count: p.openTasks },
              { id: 'questions', label: 'Questions', count: questions?.length ?? p.questionsTotal },
              { id: 'notes', label: 'My notes' },
            ]}
          />
          <div className={styles.panel}>
            {section === 'resources' && <ResourceList topicId={topicId} />}
            {section === 'tasks' && <TopicTaskList topicId={topicId} />}
            {section === 'questions' && (
              <div className={styles.questions}>
                {questions?.length ? (
                  questions.map((q, i) => (
                    <QuestionCard key={`${q.id}-${q.lastAttempt?.id ?? 0}-${String(q.lastAttempt?.correct)}`} question={q} index={i} />
                  ))
                ) : (
                  <EmptyState icon="◎" title="No questions yet" description={<>Ask Claude Code to <code>create questions on {topic.title}</code>.</>} />
                )}
              </div>
            )}
            {section === 'notes' && <TopicNotes key={topic.notes ?? ''} notes={topic.notes} saving={update.isPending} onSave={(notes) => update.mutate({ notes })} />}
          </div>
        </div>

        <aside className={styles.side}>
          <Card>
            <div className={styles.ringRow}>
              <ProgressRing value={p.percent} size={104} label="progress" />
              <ul className={styles.stats}>
                <li><span>Resources</span><strong>{p.resourcesDone}/{p.resourcesTotal}</strong></li>
                <li><span>Correct answers</span><strong>{p.questionsPassed}/{p.questionsTotal}</strong></li>
                <li><span>Quiz accuracy</span><strong>{p.mastery === null ? '—' : `${p.mastery}%`}</strong></li>
                <li><span>Open tasks</span><strong>{p.openTasks}</strong></li>
              </ul>
            </div>
          </Card>
          <Card title="How well do I understand this?">
            <UnderstandingRating value={topic.understanding} onChange={(understanding) => update.mutate({ understanding })} />
          </Card>
          <Card className={styles.claude}>
            <span className={styles.kicker}>✦ Study with Claude</span>
            <ul className={styles.tips}>
              <li><code>create 5 questions on {topic.title}</code></li>
              <li><code>review my open-ended answers</code></li>
              <li><code>check my notes on this topic</code></li>
            </ul>
            {p.pendingReviews > 0 && <Badge tone="violet">{p.pendingReviews} answers awaiting review</Badge>}
          </Card>
        </aside>
      </div>
    </>
  )
}
