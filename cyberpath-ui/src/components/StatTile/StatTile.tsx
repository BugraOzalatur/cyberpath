import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'
import styles from './StatTile.module.css'

export interface StatTileProps {
  label: string
  value: ReactNode
  hint?: ReactNode
  icon?: ReactNode
  tone?: 'accent' | 'info' | 'warn' | 'violet'
}

export const StatTile = ({ label, value, hint, icon, tone = 'accent' }: StatTileProps) => (
  <div className={styles.tile}>
    <div className={styles.top}>
      <span className={styles.label}>{label}</span>
      {icon && <span className={cn(styles.icon, styles[tone])}>{icon}</span>}
    </div>
    <div className={styles.value}>{value}</div>
    {hint && <div className={styles.hint}>{hint}</div>}
  </div>
)
