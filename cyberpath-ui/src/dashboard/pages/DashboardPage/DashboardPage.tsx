import { Link } from 'react-router'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { Loader } from '@/components/Loader'
import { PageHeader } from '@/components/PageHeader'
import { ProgressRing } from '@/components/ProgressRing'
import { StatTile } from '@/components/StatTile'
import { formatLongDay, formatMinutes, todayIso } from '@/utils/date'
import { ActivityHeatmap } from '../../components/ActivityHeatmap'
import { TopicBriefList } from '../../components/TopicBriefList'
import { WeeklyChart } from '../../components/WeeklyChart'
import { useDashboardQuery } from '../../hooks/useDashboardQuery'
import styles from './DashboardPage.module.css'

const weekDelta = (current: number, previous: number) => {
  if (previous === 0) return current > 0 ? '0 min last week' : 'no entries yet'
  const diff = Math.round(((current - previous) / previous) * 100)
  return `${diff >= 0 ? '▲' : '▼'} ${Math.abs(diff)}% vs last week`
}

export const DashboardPage = () => {
  const { data, isLoading, error } = useDashboardQuery()

  if (isLoading) return <Loader />
  if (error || !data) return <ErrorState error={error} />

  const current = data.activeTopics[0]

  return (
    <>
      <PageHeader
        eyebrow={`> ${formatLongDay(todayIso())}`}
        title="What are we learning today?"
        subtitle="Your roadmap progress, study streak and understanding at a glance."
        actions={
          <>
            <Link to="/journal"><Button variant="secondary">✎ Write journal</Button></Link>
            <Link to="/exam"><Button>⚑ Take an exam</Button></Link>
          </>
        }
      />

      <div className={styles.hero}>
        <Card className={styles.heroCard}>
          <div className={styles.heroInner}>
            <ProgressRing value={data.overallPercent} label="overall" />
            <div className={styles.heroText}>
              <span className={styles.kicker}>Roadmap</span>
              <h2 className={styles.heroTitle}>
                {data.topicsCompleted}/{data.topicsTotal} topics completed
              </h2>
              {current ? (
                <p className={styles.muted}>
                  Now: <strong>{current.title}</strong> · {current.percent}%
                </p>
              ) : (
                <p className={styles.muted}>No active topic. Start one from the roadmap.</p>
              )}
              <Link to={current ? `/topics/${current.id}` : '/topics'}>
                <Button size="sm">{current ? 'Continue where you left off →' : 'Go to the roadmap →'}</Button>
              </Link>
            </div>
          </div>
        </Card>

        {data.pendingReviews > 0 ? (
          <Card className={styles.claudeCard}>
            <span className={styles.kicker}>✦ Claude</span>
            <h2 className={styles.heroTitle}>{data.pendingReviews} answers awaiting review</h2>
            <p className={styles.muted}>
              Ask Claude Code to <code>review my open-ended answers</code>. The feedback shows up here.
            </p>
          </Card>
        ) : (
          <Card className={styles.claudeCard}>
            <span className={styles.kicker}>✦ Claude</span>
            <h2 className={styles.heroTitle}>Make sure you understand it</h2>
            <p className={styles.muted}>
              When you finish a topic, ask Claude Code to <code>quiz me on the topics I finished</code>. The questions are added to the topic page.
            </p>
          </Card>
        )}
      </div>

      <div className={styles.stats}>
        <StatTile label="This week" value={formatMinutes(data.minutesThisWeek)} hint={weekDelta(data.minutesThisWeek, data.minutesLastWeek)} icon="⏱" tone="info" />
        <StatTile label="Study streak" value={`${data.streakDays} days`} hint={data.streakDays ? 'Keep the chain going!' : 'Add an entry today'} icon="🔥" tone="warn" />
        <StatTile label="Quiz accuracy" value={data.quizAccuracy === null ? '—' : `${data.quizAccuracy}%`} hint="based on latest attempts" icon="◎" tone="accent" />
        <StatTile
          label="Tasks due today"
          value={data.tasksToday}
          hint={data.tasksOverdue ? `${data.tasksOverdue} overdue` : 'nothing overdue'}
          icon="☑"
          tone="violet"
        />
      </div>

      <div className={styles.grid}>
        <Card title="Weekly study time (hours)" actions={<Link to="/journal"><Button size="sm" variant="ghost">Journal →</Button></Link>}>
          <WeeklyChart weeks={data.weeks} />
        </Card>
        <Card title="Active topics" actions={<Link to="/topics"><Button size="sm" variant="ghost">All →</Button></Link>}>
          {data.activeTopics.length ? (
            <TopicBriefList topics={data.activeTopics} />
          ) : (
            <EmptyState title="No active topics" description="Mark a topic as “In progress” on the roadmap." />
          )}
          {data.reviewTopics.length > 0 && (
            <div className={styles.review}>
              <h3 className={styles.reviewTitle}>⚠ May need review</h3>
              <TopicBriefList topics={data.reviewTopics} tone="warn" />
            </div>
          )}
        </Card>
      </div>

      <Card title="Study activity">
        <ActivityHeatmap days={data.activity} />
      </Card>
    </>
  )
}
