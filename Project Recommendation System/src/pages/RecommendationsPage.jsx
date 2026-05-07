import { useState, useEffect, useMemo } from 'react'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import { readSavedProjectIds, toggleSavedProject } from '../utils/savedProjects'

const SCORE_TIERS = [
  { label: 'All',           test: () => true },
  { label: 'High (70+)',    test: (r) => r.score >= 70 },
  { label: 'Medium (45–69)',test: (r) => r.score >= 45 && r.score < 70 },
  { label: 'Rising (<45)', test: (r) => r.score < 45 },
]

const LANGUAGES = ['Any', 'JavaScript', 'TypeScript', 'Python', 'Go', 'Rust', 'Java']

/* ── Helpers ─────────────────────────────────────────────── */
function scoreColor(s) {
  if (s >= 70) return 'var(--prs-success)'
  if (s >= 45) return 'var(--prs-accent-warm)'
  return 'var(--prs-muted)'
}

function ScoreRing({ score }) {
  const r = 16, circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  const color = scoreColor(score)
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" aria-label={`Score ${score}/100`} style={{ flexShrink: 0 }}>
      <circle cx="22" cy="22" r={r} fill="none" stroke="var(--prs-border)" strokeWidth="3.5" />
      <circle
        cx="22" cy="22" r={r} fill="none"
        stroke={color} strokeWidth="3.5"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 22 22)"
      />
      <text x="22" y="26" textAnchor="middle" fontSize="10" fontWeight="700" fill={color}>{score}</text>
    </svg>
  )
}

function BookmarkIcon({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function FreshnessTag({ pushedAt }) {
  const days = Math.floor((Date.now() - new Date(pushedAt).getTime()) / 86_400_000)
  const [label, color] =
    days < 7  ? ['Active this week', 'var(--prs-success)'] :
    days < 30 ? [`${days}d ago`,      'var(--prs-primary)'] :
    days < 90 ? [`${Math.floor(days/30)}mo ago`, 'var(--prs-accent-warm)'] :
                [`${Math.floor(days/30)}mo ago`, 'var(--prs-muted)']
  return <span style={{ color, fontWeight: 600, fontSize: '0.75rem' }}>{label}</span>
}

function RepoRow({ index, repo, saved, onToggleSaved }) {
  return (
    <li style={{
      display: 'grid',
      gridTemplateColumns: 'auto auto 1fr auto',
      gap: '0.85rem',
      alignItems: 'center',
      padding: '0.9rem 1rem',
      borderRadius: 'var(--prs-radius)',
      border: '1px solid var(--prs-border)',
      background: 'var(--prs-surface)',
      boxShadow: 'var(--prs-shadow-sm)',
    }}>
      {/* Rank */}
      <span style={{
        width: '1.8rem', height: '1.8rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: '0.45rem',
        background: 'var(--prs-primary-faint)',
        color: 'var(--prs-primary)',
        fontWeight: 700, fontSize: '0.8125rem', flexShrink: 0,
      }}>
        {index + 1}
      </span>

      {/* Score ring */}
      <ScoreRing score={repo.score} />

      {/* Body */}
      <div style={{ minWidth: 0 }}>
        <a
          href={repo.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontWeight: 600, color: 'var(--prs-text)', textDecoration: 'none', fontSize: '0.9375rem', wordBreak: 'break-word' }}
          onMouseEnter={e => e.target.style.color = 'var(--prs-primary)'}
          onMouseLeave={e => e.target.style.color = 'var(--prs-text)'}
        >
          {repo.title}
        </a>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem 0.75rem', marginTop: '0.2rem', alignItems: 'center' }}>
          {repo.language && (
            <span style={{ color: 'var(--prs-primary)', fontWeight: 600, fontSize: '0.75rem' }}>{repo.language}</span>
          )}
          <span style={{ fontSize: '0.75rem', color: 'var(--prs-muted)' }}>★ {repo.stars.toLocaleString()}</span>
          <FreshnessTag pushedAt={repo.lastPushed} />
          {repo.license && <span style={{ fontSize: '0.75rem', color: 'var(--prs-muted)' }}>{repo.license}</span>}
        </div>

        {repo.tagline && repo.tagline !== 'No description provided.' && (
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: 'var(--prs-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {repo.tagline}
          </p>
        )}

        {repo.tech.length > 0 && (
          <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', listStyle: 'none', margin: '0.4rem 0 0', padding: 0 }}>
            {repo.tech.slice(0, 4).map(t => (
              <li key={t} style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '0.3rem', background: 'var(--prs-bg-subtle)', color: 'var(--prs-muted)' }}>
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Save button */}
      <button
        type="button"
        className={`prs-card__icon-btn${saved ? ' prs-card__icon-btn--active' : ''}`}
        aria-pressed={saved}
        aria-label={saved ? 'Remove from saved' : 'Save project'}
        style={{ flexShrink: 0, alignSelf: 'flex-start', marginTop: '0.1rem' }}
        onClick={() => onToggleSaved(repo)}
      >
        <BookmarkIcon filled={saved} />
      </button>
    </li>
  )
}

/* ── Page ─────────────────────────────────────────────────── */
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
    const fn = SCORE_TIERS.find(t => t.label === tier)?.test ?? (() => true)
    return repos.filter(fn)
  }, [repos, tier])

  const handleToggleSave = (repo) => {
    setSavedIds(toggleSavedProject(repo))
  }

  return (
    <>
      <h1 className="prs-page-title">
        Recommended for {user?.name?.split(' ')[0] ?? 'You'}
      </h1>
      <p className="prs-page-lead">
        Curated open-source projects ranked by health score — a composite of maintenance activity,
        documentation quality, community size, and contributor-friendliness.
      </p>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem', alignItems: 'center' }}>
        <div className="prs-filters" style={{ margin: 0, flex: '1 1 auto' }} role="group" aria-label="Score tier">
          {SCORE_TIERS.map(({ label }) => (
            <button key={label} type="button"
              className={`prs-chip${label === tier ? ' prs-chip--active' : ''}`}
              onClick={() => setTier(label)}>
              {label}
            </button>
          ))}
        </div>
        <select className="prs-input" value={lang} onChange={e => setLang(e.target.value)}
          aria-label="Filter by language"
          style={{ flex: '0 0 auto', fontSize: '0.8125rem', padding: '0.4rem 0.65rem' }}>
          {LANGUAGES.map(l => <option key={l}>{l}</option>)}
        </select>
      </div>

      {/* Score legend */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {[['High 70+', 'var(--prs-success)'], ['Medium 45–69', 'var(--prs-accent-warm)'], ['Rising <45', 'var(--prs-muted)']].map(([l, c]) => (
          <span key={l} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--prs-muted)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block' }} />
            {l}
          </span>
        ))}
      </div>

      {error && <p style={{ color: '#dc2626', marginBottom: '1rem', fontSize: '0.875rem' }} role="alert">{error}</p>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--prs-muted)' }}>
          Fetching recommendations from GitHub…
        </div>
      ) : (
        <>
          <p style={{ fontSize: '0.8125rem', color: 'var(--prs-muted)', marginBottom: '0.85rem' }}>
            {filtered.length} project{filtered.length !== 1 ? 's' : ''} · sorted by health score
          </p>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {filtered.map((repo, i) => (
              <RepoRow
                key={repo.id}
                index={i}
                repo={repo}
                saved={savedIds.includes(repo.id)}
                onToggleSaved={handleToggleSave}
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
