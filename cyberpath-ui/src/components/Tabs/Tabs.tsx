import { cn } from '@/utils/cn'
import styles from './Tabs.module.css'

export interface TabItem<T extends string> {
  id: T
  label: string
  count?: number
}

export interface TabsProps<T extends string> {
  items: TabItem<T>[]
  active: T
  onChange: (id: T) => void
}

export const Tabs = <T extends string>({ items, active, onChange }: TabsProps<T>) => (
  <div className={styles.tabs} role="tablist">
    {items.map((item) => (
      <button
        key={item.id}
        role="tab"
        aria-selected={item.id === active}
        className={cn(styles.tab, item.id === active && styles.active)}
        onClick={() => onChange(item.id)}
      >
        {item.label}
        {item.count !== undefined && <span className={styles.count}>{item.count}</span>}
      </button>
    ))}
  </div>
)
