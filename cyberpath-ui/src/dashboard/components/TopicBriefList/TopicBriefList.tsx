import { Link } from 'react-router'
import { ProgressBar } from '@/components/ProgressBar'
import type { TopicBrief } from '../../types'
import styles from './TopicBriefList.module.css'

export interface TopicBriefListProps {
  topics: TopicBrief[]
  tone?: 'accent' | 'warn'
}

export const TopicBriefList = ({ topics, tone = 'accent' }: TopicBriefListProps) => (
  <ul className={styles.list}>
    {topics.map((topic) => (
      <li key={topic.id}>
        <Link to={`/topics/${topic.id}`} className={styles.item}>
          <div className={styles.row}>
            <span className={styles.title}>{topic.title}</span>
            <span className={styles.meta}>
              {topic.percent}%
              {topic.mastery !== null && <> · quiz {topic.mastery}%</>}
            </span>
          </div>
          <ProgressBar value={topic.percent} size="sm" tone={tone} />
        </Link>
      </li>
    ))}
  </ul>
)
