import { useState, useEffect, useMemo } from 'react'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import { readSavedProjectIds, toggleSavedProjectId } from '../utils/savedProjects'

const SCORE_TIERS = [
  { label: 'All', test: () => true },
  { label: 'High (70+)', test: (r) => r.score >= 70 },
  { label: 'Medium (45–69)', test: (r) => r.score >= 45 && r.score < 70 },
  { label: 'Rising (<45)', test: (r) => r.score < 45 },
]

const LANGUAGES = ['Any', 'JavaScript', 'TypeScript', 'Python', 'Go', 'Rust', 'Java']

function ScoreRing({ score }) {
  const color = score >= 70 ? 'var(--prs-success)' : score >= 45 ? 'var(--prs-accent-warm)' : 'var(--prs-muted)'
  const r = 18
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="24" cy="24" r={r} fill="none" stroke="var(--prs-border)" strokeWidth="4" />
      <circle
        cx="24" cy="24" r={r} fill="none"
        stroke={color} strokeWidth="4"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 24 24)"
        style={{ transition: 'stroke-dasharray 0.4s ease' }}
      />
      <text x="24" y="28" textAnchor="middle" fontSize="11" fontWeight="700" fill={color}>{score}</text>
    </svg>
  )
}

function BookmarkIcon({ filled }) {
  return (
    <svg className="prs-icon" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function RepoRow({ index, repo, saved, onToggleSaved }) {
  const daysSince = Math.floor((Date.now() - new Date(repo.lastPushed).getTime()) / 86_400_000)
  return (
    <li className="prs-rank__item">
      <span className="prs-rank__index">{index + 1}</span>
      <ScoreRing score={repo.score} />
      <div className="prs-rank__body" style={{ minWidth: 0 }}>
        <a href={repo.githubUrl} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-word' }}>
          {repo.title}
        </a>
        <p className="prs-rank__meta" style={{ margin: '0.15rem 0 0', fontSize: '0.8125rem' }}>
          {repo.language && <span style={{ color: 'var(--prs-primary)', fontWeight: 600 }}>{repo.language} · </span>}
          ★ {repo.stars.toLocaleString()} · {daysSince < 7 ? 'Updated this week' : daysSince < 30 ? `${daysSince}d ago` : `${Math.floor(daysSince / 30)}mo ago`}
          {repo.license && ` · ${repo.license}`}
        </p>
        {repo.tagline && repo.tagline !== 'No description provided.' && (
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--prs-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
            {repo.tagline}
          </p>
        )}
        {repo.tech.length > 0 && (
          <ul className="prs-card__tags" style={{ marginTop: '0.4rem', marginBottom: 0 }}>
            {repo.tech.slice(0, 3).map((t) => <li key={t}>{t}</li>)}
          </ul>
        )}
      </div>
      <button
        type="button"
        className={`prs-card__icon-btn${saved ? ' prs-card__icon-btn--active' : ''}`}
        aria-pressed={saved}
        aria-label={saved ? 'Remove from saved' : 'Save project'}
        onClick={() => onToggleSaved(repo.id)}
      >
        <BookmarkIcon filled={saved} />
      </button>
    </li>
  )
}

export function RecommendationsPage() {
  const { user } = useAuth()
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tier, setTier] = useState('All')
  const [lang, setLang] = useState('Any')
  const [savedIds, setSavedIds] = useState(() => readSavedProjectIds())

  useEffect(() => {
    setLoading(true)
    setError('')
    api.github.recommended(lang === 'Any' ? '' : lang, 30)
      .then((data) => setRepos(data.repos || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [lang])

  const filtered = useMemo(() => {
    const tierFn = SCORE_TIERS.find((t) => t.label === tier)?.test ?? (() => true)
    return repos.filter(tierFn)
  }, [repos, tier])

  return (
    <>
      <h1 className="prs-page-title">
        Recommended for {user?.name?.split(' ')[0] ?? 'You'}
      </h1>
      <p className="prs-page-lead">
        Curated open-source projects from GitHub, ranked by our health score. Higher scores mean
        active maintenance, good documentation, and welcoming contributor practices.
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem', alignItems: 'center' }}>
        <div className="prs-filters" style={{ margin: 0 }} role="group" aria-label="Filter by score tier">
          {SCORE_TIERS.map(({ label }) => (
            <button
              key={label}
              type="button"
              className={`prs-chip${label === tier ? ' prs-chip--active' : ''}`}
              onClick={() => setTier(label)}
            >
              {label}
            </button>
          ))}
        </div>

        <select
          className="prs-input"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          aria-label="Filter by language"
          style={{ fontSize: '0.8125rem', padding: '0.4rem 0.65rem', height: 'auto' }}
        >
          {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
        </select>
      </div>

      {error && (
        <p style={{ color: '#dc2626', marginBottom: '1rem', fontSize: '0.875rem' }} role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--prs-muted)' }}>
          Fetching recommendations from GitHub…
        </div>
      ) : (
        <>
          <p style={{ fontSize: '0.8125rem', color: 'var(--prs-muted)', marginBottom: '1rem' }}>
            {filtered.length} project{filtered.length !== 1 ? 's' : ''} · sorted by health score
          </p>
          <ol className="prs-rank" style={{ counterReset: 'none' }}>
            {filtered.map((repo, i) => (
              <RepoRow
                key={repo.id}
                index={i}
                repo={repo}
                saved={savedIds.includes(repo.id)}
                onToggleSaved={(id) => setSavedIds(toggleSavedProjectId(id))}
              />
            ))}
          </ol>
          {filtered.length === 0 && (
            <p className="prs-page-lead">No projects match this filter.</p>
          )}
        </>
      )}
    </>
  )
}
