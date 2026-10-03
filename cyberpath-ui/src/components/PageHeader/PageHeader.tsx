import type { ReactNode } from 'react'
import styles from './PageHeader.module.css'

export interface PageHeaderProps {
  title: ReactNode
  subtitle?: ReactNode
  actions?: ReactNode
  eyebrow?: ReactNode
}

export const PageHeader = ({ title, subtitle, actions, eyebrow }: PageHeaderProps) => (
  <header className={styles.header}>
    <div>
      {eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}
      <h1>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
    {actions && <div className={styles.actions}>{actions}</div>}
  </header>
)
