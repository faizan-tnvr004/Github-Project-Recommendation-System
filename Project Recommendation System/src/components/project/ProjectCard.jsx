import { Link } from 'react-router-dom'

function BookmarkIcon({ filled }) {
  return (
    <svg className="prs-icon" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function getDifficulty(project) {
  const score = project?.matchScore ?? 0
  if (score >= 92) return 'Advanced'
  if (score >= 85) return 'Intermediate'
  return 'Beginner'
}

export function ProjectCard({ project, showScore = true, saved = false, onToggleSaved }) {
  return (
    <article className="prs-card">
      <div className="prs-card__top">
        <span className="prs-badge">{getDifficulty(project)}</span>
        <button
          type="button"
          className={`prs-card__icon-btn${saved ? ' prs-card__icon-btn--active' : ''}`}
          aria-pressed={saved}
          aria-label={saved ? 'Remove from saved projects' : 'Save project'}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onToggleSaved?.(project.id)
          }}
        >
          <BookmarkIcon filled={saved} />
        </button>
        {showScore && (
          <span className="prs-card__score" title="Recommendation match">
            {project.matchScore}% match
          </span>
        )}
      </div>
      <h3 className="prs-card__title">
        <Link to={`/projects/${project.id}`}>{project.title}</Link>
      </h3>
      <p className="prs-card__tagline">{project.tagline}</p>
      <ul className="prs-card__tags">
        {project.tech.slice(0, 3).map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <div className="prs-card__meta">
        <span>{project.duration}</span>
        <span>{project.teamSize} people</span>
      </div>
      <Link to={`/projects/${project.id}`} className="prs-card__cta">
        View brief
      </Link>
    </article>
  )
}
