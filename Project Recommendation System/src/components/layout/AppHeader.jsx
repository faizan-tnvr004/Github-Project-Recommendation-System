import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      style={{ width: '0.95rem', height: '0.95rem', color: 'var(--prs-muted)', flexShrink: 0 }}
      aria-hidden="true">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  )
}

export function AppHeader({ onMenuClick, menuOpen }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    navigate(`/projects?q=${encodeURIComponent(q)}`)
  }

  return (
    <header className="prs-header">
      <div className="prs-header__row">
        <button
          type="button"
          className="prs-header__menu"
          aria-expanded={menuOpen}
          aria-controls="prs-sidebar-panel"
          onClick={onMenuClick}
        >
          <span className="prs-sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
          <span className="prs-header__menu-icon" aria-hidden="true" />
        </button>

        <Link to="/" className="prs-header__mobile-brand">ProjectMatch</Link>

        <form
          className="prs-header__search"
          role="search"
          onSubmit={handleSearch}
          style={{ display: 'flex', alignItems: 'center', position: 'relative' }}
        >
          <span style={{ position: 'absolute', left: '0.75rem', pointerEvents: 'none', display: 'flex' }}>
            <SearchIcon />
          </span>
          <label htmlFor="prs-search" className="prs-sr-only">Search projects</label>
          <input
            id="prs-search"
            type="search"
            className="prs-input prs-header__search-input"
            placeholder="Search projects, tech, teams…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(e) }}
            autoComplete="off"
            style={{ paddingLeft: '2.25rem', width: '100%' }}
          />
        </form>

        <div className="prs-header__actions">
          <Link to="/profile" style={{ display: 'flex' }} aria-label="Go to profile">
            <span className="prs-header__avatar" title="Profile" />
          </Link>
        </div>
      </div>
    </header>
  )
}
