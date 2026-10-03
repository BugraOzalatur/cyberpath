import { NavLink, Outlet } from 'react-router'
import { cn } from '@/utils/cn'
import styles from './MainLayout.module.css'

const NAV = [
  { to: '/', label: 'Dashboard', icon: '◈', end: true },
  { to: '/topics', label: 'Roadmap', icon: '⌁' },
  { to: '/tasks', label: 'Tasks', icon: '☑' },
  { to: '/journal', label: 'Journal', icon: '✎' },
  { to: '/exam', label: 'Exam', icon: '⚑' },
]

export const MainLayout = () => (
  <div className={styles.shell}>
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <img src="/favicon.svg" alt="" className={styles.logo} />
        <div>
          <div className={styles.brandName}>CyberPath</div>
          <div className={styles.brandSub}>learning tracker</div>
        </div>
      </div>
      <nav className={styles.nav}>
        {NAV.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => cn(styles.link, isActive && styles.active)}>
            <span className={styles.icon}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className={styles.footer}>
        <div className={styles.claude}>
          <span className={styles.pulse} />
          Works with Claude via MCP
        </div>
        <p>Ask Claude Code: “check my progress and quiz me”.</p>
      </div>
    </aside>
    <main className={styles.main}>
      <Outlet />
    </main>
  </div>
)
