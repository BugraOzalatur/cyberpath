import { UNDERSTANDING_LABELS } from '@/constants'
import { cn } from '@/utils/cn'
import styles from './UnderstandingRating.module.css'

export interface UnderstandingRatingProps {
  value: number | null
  onChange: (value: number) => void
}

export const UnderstandingRating = ({ value, onChange }: UnderstandingRatingProps) => (
  <div className={styles.wrapper}>
    <div className={styles.scale} role="radiogroup" aria-label="Understanding level">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          role="radio"
          aria-checked={value === n}
          title={UNDERSTANDING_LABELS[n]}
          className={cn(styles.step, value !== null && n <= value && styles.filled)}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}
    </div>
    <span className={styles.label}>{value ? UNDERSTANDING_LABELS[value] : 'Not rated yet'}</span>
  </div>
)
