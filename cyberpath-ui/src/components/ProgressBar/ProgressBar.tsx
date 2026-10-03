import { cn } from '@/utils/cn'
import styles from './ProgressBar.module.css'

export interface ProgressBarProps {
  value: number
  tone?: 'accent' | 'info' | 'warn'
  size?: 'sm' | 'md'
}

export const ProgressBar = ({ value, tone = 'accent', size = 'md' }: ProgressBarProps) => {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className={cn(styles.track, styles[size])} role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
      <div className={cn(styles.fill, styles[tone])} style={{ width: `${clamped}%` }} />
    </div>
  )
}
