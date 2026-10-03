import styles from './ProgressRing.module.css'

export interface ProgressRingProps {
  value: number
  size?: number
  label?: string
}

export const ProgressRing = ({ value, size = 120, label }: ProgressRingProps) => {
  const stroke = 10
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className={styles.ring} style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle className={styles.track} cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke} />
        <circle
          className={styles.value}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped / 100)}
        />
      </svg>
      <div className={styles.center}>
        <span className={styles.number}>{clamped}%</span>
        {label && <span className={styles.label}>{label}</span>}
      </div>
    </div>
  )
}
