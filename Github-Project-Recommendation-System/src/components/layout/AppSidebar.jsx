import { Link, NavLink } from 'react-router-dom'

const nav = [
  { to: '/dashboard', label: 'Dashboard', end: true },
  { to: '/recommendations', label: 'Recommended Projects' },
  { to: '/saved', label: 'Saved Projects' },
  { to: '/profile', label: 'Profile' },
  { to: '/settings', label: 'Settings' },
]

export function AppSidebar({ onNavigate, theme, onToggleTheme }) {
  const linkClass = ({ isActive }) =>
    `prs-sidebar__link${isActive ? ' prs-sidebar__link--active' : ''}`

  return (
    <aside className="prs-sidebar" aria-label="Main navigation">
      <Link to="/" className="prs-sidebar__brand" onClick={onNavigate}>
        <span className="prs-sidebar__logo" aria-hidden="true" />
        <div>
          <strong className="prs-sidebar__title">ProjectMatch</strong>
          <span className="prs-sidebar__subtitle">Your workspace</span>
        </div>
      </Link>
      <nav className="prs-sidebar__nav">
        {nav.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={linkClass}
            onClick={onNavigate}
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="prs-sidebar__footer">
        <button
          type="button"
          className="prs-sidebar__link"
          onClick={() => {
            onToggleTheme?.()
            onNavigate?.()
          }}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{ width: '100%', textAlign: 'left' }}
        >
          Dark Mode
        </button>
        <p className="prs-sidebar__hint" style={{ marginTop: '0.75rem' }}>
          Theme: <strong style={{ color: 'var(--prs-text)' }}>{theme}</strong>
        </p>
      </div>
    </aside>
  )
}
