import { useEffect, type ReactNode } from 'react'
import styles from './Modal.module.css'

export interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export const Modal = ({ open, title, onClose, children }: ModalProps) => {
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className={styles.backdrop} onMouseDown={onClose}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2>{title}</h2>
          <button className={styles.close} onClick={onClose} aria-label="Close">×</button>
        </header>
        {children}
      </div>
    </div>
  )
}
