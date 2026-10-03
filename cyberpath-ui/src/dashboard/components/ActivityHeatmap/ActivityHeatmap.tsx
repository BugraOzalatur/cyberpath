import { formatDay, formatMinutes } from '@/utils/date'
import type { DayActivity } from '../../types'
import styles from './ActivityHeatmap.module.css'

const level = (minutes: number) => {
  if (minutes === 0) return 0
  if (minutes < 30) return 1
  if (minutes < 60) return 2
  if (minutes < 120) return 3
  return 4
}

/** GitHub style: columns are weeks, rows are Monday→Sunday. */
export const ActivityHeatmap = ({ days }: { days: DayActivity[] }) => {
  if (days.length === 0) return null
  const [y, m, d] = days[0].date.split('-').map(Number)
  const firstWeekday = (new Date(y, m - 1, d).getDay() + 6) % 7
  const cells: Array<DayActivity | null> = [...Array(firstWeekday).fill(null), ...days]
  const activeDays = days.filter((day) => day.minutes > 0).length

  return (
    <div>
      <div className={styles.grid}>
        {cells.map((day, i) =>
          day ? (
            <span key={day.date} className={styles.cell} data-level={level(day.minutes)} title={`${formatDay(day.date)} · ${formatMinutes(day.minutes)}`} />
          ) : (
            <span key={`pad-${i}`} className={styles.pad} />
          ),
        )}
      </div>
      <div className={styles.legend}>
        <span>{activeDays} active days in the last 12 weeks</span>
        <span className={styles.scale}>
          less
          {[0, 1, 2, 3, 4].map((l) => (
            <span key={l} className={styles.cell} data-level={l} />
          ))}
          more
        </span>
      </div>
    </div>
  )
}
