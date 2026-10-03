import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'
import styles from './Badge.module.css'

export type BadgeTone = 'neutral' | 'accent' | 'info' | 'warn' | 'danger' | 'violet'

export interface BadgeProps {
  tone?: BadgeTone
  children: ReactNode
}

export const Badge = ({ tone = 'neutral', children }: BadgeProps) => (
  <span className={cn(styles.badge, styles[tone])}>{children}</span>
)
