import { Link, useParams } from 'react-router-dom'
import { getProjectById } from '../data/projects'

export function ProjectDetailPage() {
  const { id } = useParams()
  const project = id ? getProjectById(id) : undefined

  if (!project) {
    return (
      <div className="prs-empty">
        <h1>Project not found</h1>
        <p>That brief may have been archived or the link is incorrect.</p>
        <Link to="/projects" className="prs-button prs-button--primary">
          Back to projects
        </Link>
      </div>
    )
  }

  return (
    <article className="prs-detail">
      <div className="prs-detail__header">
        <div className="prs-detail__badges">
          <span className="prs-badge">{project.category}</span>
          <span className="prs-card__score">{project.matchScore}% match</span>
        </div>
        <h1>{project.title}</h1>
        <p className="prs-detail__tagline">{project.tagline}</p>
      </div>

      <section className="prs-detail__section">
        <h2>Summary</h2>
        <p>{project.description}</p>
      </section>

      <section className="prs-detail__section">
        <h2>Highlights</h2>
        <ul className="prs-detail__list">
          {project.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </section>

      <section className="prs-detail__section">
        <h2>Tech &amp; shape</h2>
        <p>
          <strong style={{ color: 'var(--prs-text)' }}>Stack:</strong>{' '}
          {project.tech.join(', ')}
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          <strong style={{ color: 'var(--prs-text)' }}>Timeline:</strong> {project.duration} ·{' '}
          <strong style={{ color: 'var(--prs-text)' }}>Team:</strong> {project.teamSize}
        </p>
      </section>

      <div className="prs-detail__actions">
        <button type="button" className="prs-button prs-button--primary">
          Save to shortlist
        </button>
        <Link to="/recommendations" className="prs-button prs-button--ghost">
          Compare with recommendations
        </Link>
      </div>
    </article>
  )
}
