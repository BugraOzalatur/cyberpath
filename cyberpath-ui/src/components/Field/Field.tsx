import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'
import styles from './Field.module.css'

interface WrapperProps {
  label?: ReactNode
  hint?: ReactNode
  className?: string
  children: ReactNode
}

const Wrapper = ({ label, hint, className, children }: WrapperProps) => (
  <label className={cn(styles.field, className)}>
    {label && <span className={styles.label}>{label}</span>}
    {children}
    {hint && <span className={styles.hint}>{hint}</span>}
  </label>
)

type WithLabel = { label?: ReactNode; hint?: ReactNode; wrapperClassName?: string }

export const Input = ({ label, hint, wrapperClassName, className, ...rest }: InputHTMLAttributes<HTMLInputElement> & WithLabel) => (
  <Wrapper label={label} hint={hint} className={wrapperClassName}>
    <input className={cn(styles.control, className)} {...rest} />
  </Wrapper>
)

export const Textarea = ({ label, hint, wrapperClassName, className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement> & WithLabel) => (
  <Wrapper label={label} hint={hint} className={wrapperClassName}>
    <textarea className={cn(styles.control, styles.textarea, className)} {...rest} />
  </Wrapper>
)

export const Select = ({ label, hint, wrapperClassName, className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement> & WithLabel) => (
  <Wrapper label={label} hint={hint} className={wrapperClassName}>
    <select className={cn(styles.control, styles.select, className)} {...rest}>
      {children}
    </select>
  </Wrapper>
)
