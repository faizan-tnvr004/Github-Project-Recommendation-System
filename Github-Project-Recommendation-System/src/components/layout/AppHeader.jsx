import { useState } from 'react'
import { Link } from 'react-router-dom'

export function AppHeader({ onMenuClick, menuOpen }) {
  const [query, setQuery] = useState('')

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
        <Link to="/" className="prs-header__mobile-brand">
          ProjectMatch
        </Link>
        <div className="prs-header__search" role="search">
          <label htmlFor="prs-search" className="prs-sr-only">
            Search projects
          </label>
          <input
            id="prs-search"
            type="search"
            className="prs-input prs-header__search-input"
            placeholder="Search projects, tech, teams…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="prs-header__actions">
          <span className="prs-header__avatar" aria-hidden="true" title="Profile" />
        </div>
      </div>
    </header>
  )
}
