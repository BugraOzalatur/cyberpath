import { errorMessage } from '@/modules/axios'
import styles from './ErrorState.module.css'

export const ErrorState = ({ error }: { error: unknown }) => (
  <div className={styles.error} role="alert">
    <strong>Something went wrong.</strong> {errorMessage(error)}
    <div className={styles.hint}>Is the API running? <code>docker compose up -d</code></div>
  </div>
)
