import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: 'sm' | 'md'
}

export const Button = ({ variant = 'primary', size = 'md', className, type = 'button', ...rest }: ButtonProps) => (
  <button type={type} className={cn(styles.button, styles[variant], styles[size], className)} {...rest} />
)
