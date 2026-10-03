import { STATUS_LABELS } from '@/constants'
import type { TopicStatus } from '@/types'
import { cn } from '@/utils/cn'
import styles from './StatusSwitch.module.css'

const STATUSES: TopicStatus[] = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']

export interface StatusSwitchProps {
  value: TopicStatus
  onChange: (status: TopicStatus) => void
  disabled?: boolean
}

export const StatusSwitch = ({ value, onChange, disabled }: StatusSwitchProps) => (
  <div className={styles.switch} role="radiogroup" aria-label="Topic status">
    {STATUSES.map((status) => (
      <button
        key={status}
        role="radio"
        aria-checked={status === value}
        disabled={disabled}
        className={cn(styles.option, status === value && styles[status])}
        onClick={() => status !== value && onChange(status)}
      >
        {STATUS_LABELS[status]}
      </button>
    ))}
  </div>
)
