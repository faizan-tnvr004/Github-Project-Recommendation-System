import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { readSavedProjectIds, toggleSavedProjectId } from '../utils/savedProjects'

const LANGUAGES = ['Any', 'JavaScript', 'TypeScript', 'Python', 'Go', 'Rust', 'Java', 'C++', 'Ruby', 'PHP']

function ScoreBar({ score }) {
  const color = score >= 70 ? 'var(--prs-success)' : score >= 45 ? 'var(--prs-accent-warm)' : 'var(--prs-muted)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
      <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--prs-border)', overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 0.4s ease' }} />
      </div>
      <span style={{ fontSize: '0.75rem', fontWeight: 700, color, whiteSpace: 'nowrap' }}>{score}/100</span>
    </div>
  )
}

function GithubProjectCard({ repo, saved, onToggleSaved }) {
  const daysSince = Math.floor((Date.now() - new Date(repo.lastPushed).getTime()) / 86_400_000)
  const freshness = daysSince < 7 ? 'Active' : daysSince < 30 ? 'Recent' : daysSince < 90 ? 'Moderate' : 'Stale'
  const freshnessColor = daysSince < 7 ? 'var(--prs-success)' : daysSince < 30 ? 'var(--prs-primary)' : daysSince < 90 ? 'var(--prs-accent-warm)' : 'var(--prs-muted)'

  return (
    <article className="prs-card">
      <div className="prs-card__top">
        <span className="prs-badge" style={{ background: 'var(--prs-primary-faint)', color: 'var(--prs-primary)' }}>
          {repo.language || 'Other'}
        </span>
        <button
          type="button"
          className={`prs-card__icon-btn${saved ? ' prs-card__icon-btn--active' : ''}`}
          aria-pressed={saved}
          aria-label={saved ? 'Remove from saved' : 'Save project'}
          onClick={(e) => { e.preventDefault(); onToggleSaved?.(repo.id) }}
        >
          <BookmarkIcon filled={saved} />
        </button>
      </div>

      <h3 className="prs-card__title" style={{ fontSize: '0.95rem' }}>
        <a href={repo.githubUrl} target="_blank" rel="noopener noreferrer">{repo.title}</a>
      </h3>

      <p className="prs-card__tagline">{repo.tagline}</p>

      {repo.tech.length > 0 && (
        <ul className="prs-card__tags">
          {repo.tech.slice(0, 4).map((t) => <li key={t}>{t}</li>)}
        </ul>
      )}

      <div className="prs-card__meta">
        <span title="Stars">★ {repo.stars.toLocaleString()}</span>
        <span title="Forks">⑂ {repo.forks.toLocaleString()}</span>
        <span title="Open issues">◎ {repo.openIssues}</span>
        <span style={{ color: freshnessColor, fontWeight: 600 }}>{freshness}</span>
        {repo.license && <span>{repo.license}</span>}
      </div>

      <ScoreBar score={repo.score} />

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.85rem', flexWrap: 'wrap' }}>
        <a href={repo.githubUrl} target="_blank" rel="noopener noreferrer" className="prs-card__cta">
          View on GitHub →
        </a>
        {repo.homepage && (
          <a href={repo.homepage} target="_blank" rel="noopener noreferrer" className="prs-card__cta" style={{ color: 'var(--prs-muted)' }}>
            Website
          </a>
        )}
      </div>
    </article>
  )
}

function BookmarkIcon({ filled }) {
  return (
    <svg className="prs-icon" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '1rem', height: '1rem', color: 'var(--prs-muted)' }} aria-hidden="true">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  )
}

export function ProjectsPage() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [lang, setLang] = useState('Any')
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [savedIds, setSavedIds] = useState(() => readSavedProjectIds())
  const debounceRef = useRef(null)

  const fetchRepos = useCallback(async (q, language) => {
    if (!q.trim()) { setRepos([]); return }
    setLoading(true)
    setError('')
    try {
      const data = await api.github.search(q, language === 'Any' ? '' : language, 24)
      setRepos(data.repos || [])
    } catch (err) {
      setError(err.message)
      setRepos([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(query)
    }, 500)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  useEffect(() => {
    fetchRepos(debouncedQuery, lang)
  }, [debouncedQuery, lang, fetchRepos])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchRepos(query, lang)
  }

  return (
    <>
      <h1 className="prs-page-title">Explore GitHub Projects</h1>
      <p className="prs-page-lead">
        Search real open-source projects. Each result is ranked by a health score that weighs
        documentation, maintenance activity, community engagement, and contributor-friendliness.
      </p>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 260px', minWidth: 0 }}>
          <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}>
            <SearchIcon />
          </span>
          <input
            type="search"
            className="prs-input"
            placeholder="e.g. react state management, fastapi, rust cli…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.25rem' }}
            aria-label="Search GitHub projects"
          />
        </div>

        <select
          className="prs-input"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          aria-label="Filter by language"
          style={{ flex: '0 0 auto' }}
        >
          {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
        </select>

        <button type="submit" className="prs-button prs-button--primary" disabled={loading}>
          Search
        </button>
      </form>

      {error && (
        <p style={{ color: '#dc2626', marginBottom: '1rem', fontSize: '0.875rem' }} role="alert">
          {error}
        </p>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--prs-muted)' }}>
          Searching GitHub…
        </div>
      )}

      {!loading && repos.length > 0 && (
        <>
          <p style={{ fontSize: '0.8125rem', color: 'var(--prs-muted)', marginBottom: '1rem' }}>
            {repos.length} results sorted by health score
          </p>
          <div className="prs-grid">
            {repos.map((repo) => (
              <GithubProjectCard
                key={repo.id}
                repo={repo}
                saved={savedIds.includes(repo.id)}
                onToggleSaved={(id) => setSavedIds(toggleSavedProjectId(id))}
              />
            ))}
          </div>
        </>
      )}

      {!loading && !error && repos.length === 0 && query && (
        <div className="prs-empty">
          <p>No results for &ldquo;{query}&rdquo;. Try different keywords.</p>
        </div>
      )}

      {!loading && !query && (
        <div className="prs-empty" style={{ paddingTop: '2rem' }}>
          <p style={{ color: 'var(--prs-muted)' }}>
            Type a topic, technology, or keyword above to discover projects.
          </p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['react hooks', 'machine learning', 'rust cli', 'devops tools', 'open source beginner'].map((s) => (
              <button
                key={s}
                type="button"
                className="prs-chip"
                onClick={() => setQuery(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
