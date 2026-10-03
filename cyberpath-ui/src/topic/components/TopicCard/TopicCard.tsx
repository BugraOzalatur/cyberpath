import { Link } from 'react-router'
import { Badge } from '@/components/Badge'
import { ProgressBar } from '@/components/ProgressBar'
import { STATUS_LABELS } from '@/constants'
import type { Topic } from '@/types'
import { cn } from '@/utils/cn'
import styles from './TopicCard.module.css'

const STATUS_TONE = { NOT_STARTED: 'neutral', IN_PROGRESS: 'info', COMPLETED: 'accent' } as const

export const TopicCard = ({ topic }: { topic: Topic }) => {
  const p = topic.progress
  return (
    <Link to={`/topics/${topic.id}`} className={cn(styles.card, styles[topic.status])}>
      <div className={styles.top}>
        <span className={styles.order}>#{String(topic.orderIndex).padStart(2, '0')}</span>
        <div className={styles.badges}>
          {p.needsReview && <Badge tone="warn">⚠ Review</Badge>}
          {p.pendingReviews > 0 && <Badge tone="violet">✦ {p.pendingReviews}</Badge>}
          <Badge tone={STATUS_TONE[topic.status]}>{STATUS_LABELS[topic.status]}</Badge>
        </div>
      </div>
      <h3 className={styles.title}>{topic.title}</h3>
      {topic.summary && <p className={styles.summary}>{topic.summary}</p>}
      <div className={styles.progress}>
        <ProgressBar value={p.percent} size="sm" />
        <span className={styles.percent}>{p.percent}%</span>
      </div>
      <div className={styles.meta}>
        <span title="Resources done">▣ {p.resourcesDone}/{p.resourcesTotal}</span>
        <span title="Questions answered correctly">◎ {p.questionsPassed}/{p.questionsTotal}</span>
        <span title="Open tasks">☑ {p.openTasks}</span>
      </div>
    </Link>
  )
}
