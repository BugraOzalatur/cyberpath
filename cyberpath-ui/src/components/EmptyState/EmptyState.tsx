import type { ReactNode } from 'react'
import styles from './EmptyState.module.css'

export interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: ReactNode
  action?: ReactNode
}

export const EmptyState = ({ icon = '◇', title, description, action }: EmptyStateProps) => (
  <div className={styles.empty}>
    <div className={styles.icon}>{icon}</div>
    <h3>{title}</h3>
    {description && <p className={styles.description}>{description}</p>}
    {action}
  </div>
)
