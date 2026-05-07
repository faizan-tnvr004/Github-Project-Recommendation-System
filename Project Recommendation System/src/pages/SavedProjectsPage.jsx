import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProjectCard } from '../components/project/ProjectCard'
import { projects } from '../data/projects'
import {
  readSavedProjectIds,
  readSavedGithubRepos,
  toggleSavedProject,
} from '../utils/savedProjects'

function BookmarkIcon({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function GithubSavedCard({ repo, onUnsave }) {
  const daysSince = Math.floor((Date.now() - new Date(repo.lastPushed).getTime()) / 86_400_000)
  const score = repo.score ?? 0
  const color = score >= 70 ? 'var(--prs-success)' : score >= 45 ? 'var(--prs-accent-warm)' : 'var(--prs-muted)'

  return (
    <article className="prs-card">
      <div className="prs-card__top">
        <span className="prs-badge" style={{ background: 'var(--prs-primary-faint)', color: 'var(--prs-primary)' }}>
          {repo.language || 'GitHub'}
        </span>
        <button
          type="button"
          className="prs-card__icon-btn prs-card__icon-btn--active"
          aria-pressed="true"
          aria-label="Remove from saved"
          onClick={() => onUnsave(repo)}
        >
          <BookmarkIcon filled />
        </button>
      </div>

      <h3 className="prs-card__title" style={{ fontSize: '0.9375rem' }}>
        <a href={repo.githubUrl} target="_blank" rel="noopener noreferrer">{repo.title}</a>
      </h3>

      <p className="prs-card__tagline">{repo.tagline}</p>

      {repo.tech?.length > 0 && (
        <ul className="prs-card__tags">
          {repo.tech.slice(0, 4).map(t => <li key={t}>{t}</li>)}
        </ul>
      )}

      <div className="prs-card__meta">
        <span>★ {(repo.stars ?? 0).toLocaleString()}</span>
        <span>{daysSince < 30 ? `${daysSince}d ago` : `${Math.floor(daysSince / 30)}mo ago`}</span>
        {repo.license && <span>{repo.license}</span>}
      </div>

      {/* Score bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
        <div style={{ flex: 1, height: 3, borderRadius: 2, background: 'var(--prs-border)', overflow: 'hidden' }}>
          <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 2 }} />
        </div>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color, whiteSpace: 'nowrap' }}>{score}/100</span>
      </div>

      <a href={repo.githubUrl} target="_blank" rel="noopener noreferrer" className="prs-card__cta">
        View on GitHub →
      </a>
    </article>
  )
}

export function SavedProjectsPage() {
  const [savedIds, setSavedIds] = useState(() => readSavedProjectIds())
  const [githubRepos, setGithubRepos] = useState(() => readSavedGithubRepos())

  // Local mock projects that are saved
  const savedLocalProjects = useMemo(() => {
    const set = new Set(savedIds)
    return projects.filter(p => set.has(p.id))
  }, [savedIds])

  const handleUnsave = (repo) => {
    const newIds = toggleSavedProject(repo)
    setSavedIds(newIds)
    setGithubRepos(readSavedGithubRepos())
  }

  const total = savedLocalProjects.length + githubRepos.length

  return (
    <>
      <h1 className="prs-page-title">Saved Projects</h1>
      <p className="prs-page-lead">
        {total > 0
          ? `${total} project${total !== 1 ? 's' : ''} bookmarked.`
          : 'Projects you bookmark will appear here.'}
      </p>

      {total === 0 ? (
        <div className="prs-empty">
          <p style={{ color: 'var(--prs-muted)' }}>
            Browse <Link to="/recommendations" className="auth-link">Recommendations</Link> or{' '}
            <Link to="/projects" className="auth-link">Projects</Link> and click the bookmark icon to save.
          </p>
        </div>
      ) : (
        <>
          {/* GitHub saved repos */}
          {githubRepos.length > 0 && (
            <section style={{ marginBottom: '2rem' }}>
              {savedLocalProjects.length > 0 && (
                <h2 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--prs-muted)', margin: '0 0 0.75rem' }}>
                  GitHub Projects
                </h2>
              )}
              <div className="prs-grid">
                {githubRepos.map(repo => (
                  <GithubSavedCard key={repo.id} repo={repo} onUnsave={handleUnsave} />
                ))}
              </div>
            </section>
          )}

          {/* Local mock projects */}
          {savedLocalProjects.length > 0 && (
            <section>
              {githubRepos.length > 0 && (
                <h2 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--prs-muted)', margin: '0 0 0.75rem' }}>
                  Other Projects
                </h2>
              )}
              <div className="prs-grid">
                {savedLocalProjects.map(p => (
                  <ProjectCard
                    key={p.id}
                    project={p}
                    saved
                    onToggleSaved={() => handleUnsave(p.id)}
                    showScore
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </>
  )
}
