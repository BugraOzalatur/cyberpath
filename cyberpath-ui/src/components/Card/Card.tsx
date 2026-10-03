import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/cn'
import styles from './Card.module.css'

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode
  actions?: ReactNode
  padded?: boolean
}

export const Card = ({ title, actions, padded = true, className, children, ...rest }: CardProps) => (
  <section className={cn(styles.card, className)} {...rest}>
    {(title || actions) && (
      <header className={styles.header}>
        {title && <h2 className={styles.title}>{title}</h2>}
        {actions && <div className={styles.actions}>{actions}</div>}
      </header>
    )}
    <div className={cn(padded && styles.body)}>{children}</div>
  </section>
)
