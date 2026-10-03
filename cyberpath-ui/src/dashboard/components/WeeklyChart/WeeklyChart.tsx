import { formatDay, formatMinutes } from '@/utils/date'
import type { WeekStat } from '../../types'
import styles from './WeeklyChart.module.css'

export const WeeklyChart = ({ weeks }: { weeks: WeekStat[] }) => {
  const max = Math.max(60, ...weeks.map((w) => w.minutes))
  return (
    <div className={styles.chart}>
      {weeks.map((week, i) => {
        const current = i === weeks.length - 1
        return (
          <div key={week.weekStart} className={styles.column} title={`Week of ${formatDay(week.weekStart)} · ${formatMinutes(week.minutes)} · ${week.tasksDone} tasks`}>
            <span className={styles.value}>{week.minutes ? Math.round(week.minutes / 60 * 10) / 10 : ''}</span>
            <div className={styles.barTrack}>
              <div className={current ? styles.barCurrent : styles.bar} style={{ height: `${(week.minutes / max) * 100}%` }} />
            </div>
            <span className={styles.label}>{current ? 'This week' : formatDay(week.weekStart)}</span>
          </div>
        )
      })}
    </div>
  )
}
