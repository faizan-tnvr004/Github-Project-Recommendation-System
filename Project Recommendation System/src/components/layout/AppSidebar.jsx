import { Link, NavLink } from 'react-router-dom'

const nav = [
  { to: '/dashboard',       label: 'Dashboard',            end: true },
  { to: '/recommendations', label: 'Recommended Projects'             },
  { to: '/projects',        label: 'Explore Projects'                 },
  { to: '/saved',           label: 'Saved Projects'                   },
  { to: '/profile',         label: 'Profile'                          },
  { to: '/settings',        label: 'Settings'                         },
]

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      style={{ width: '1rem', height: '1rem' }} aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      style={{ width: '1rem', height: '1rem' }} aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export function AppSidebar({ onNavigate, theme, onToggleTheme }) {
  const linkClass = ({ isActive }) =>
    `prs-sidebar__link${isActive ? ' prs-sidebar__link--active' : ''}`

  return (
    <aside className="prs-sidebar" aria-label="Main navigation">
      {/* Brand */}
      <Link to="/" className="prs-sidebar__brand" onClick={onNavigate}>
        <span className="prs-sidebar__logo" aria-hidden="true" />
        <div>
          <strong className="prs-sidebar__title">ProjectMatch</strong>
          <span className="prs-sidebar__subtitle">Your workspace</span>
        </div>
      </Link>

      {/* Nav links */}
      <nav className="prs-sidebar__nav">
        {nav.map(({ to, label, end }) => (
          <NavLink key={to} to={to} end={end} className={linkClass} onClick={onNavigate}>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Theme toggle — sits just below nav, NOT at the bottom */}
      <div style={{ marginTop: '1.25rem', padding: '0 0.35rem' }}>
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            width: '100%', padding: '0.55rem 0.85rem',
            borderRadius: '0.5rem', border: '1px solid var(--prs-border)',
            background: 'var(--prs-bg-subtle)', color: 'var(--prs-muted)',
            cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500,
            transition: 'background 0.15s ease, color 0.15s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--prs-text)'; e.currentTarget.style.background = 'var(--prs-border)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--prs-muted)'; e.currentTarget.style.background = 'var(--prs-bg-subtle)' }}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
      </div>
    </aside>
  )
}
