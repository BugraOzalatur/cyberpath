import styles from './Loader.module.css'

export const Loader = ({ label = 'Loading…' }: { label?: string }) => (
  <div className={styles.loader}>
    <span className={styles.dot} />
    <span className={styles.dot} />
    <span className={styles.dot} />
    <span className={styles.label}>{label}</span>
  </div>
)
