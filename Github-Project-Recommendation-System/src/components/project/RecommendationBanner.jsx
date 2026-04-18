import { Link } from 'react-router-dom'

export function RecommendationBanner() {
  return (
    <div className="prs-banner" role="region" aria-label="Recommendation engine">
      <div className="prs-banner__copy">
        <p className="prs-banner__eyebrow">Live signals</p>
        <h2 className="prs-banner__heading">Recommendations tuned to your stack and capacity</h2>
        <p className="prs-banner__text">
          We weigh tech fit, timeline overlap, and team size so you see viable paths—not generic
          ideas.
        </p>
        <Link to="/recommendations" className="prs-button prs-button--primary">
          See ranked picks
        </Link>
      </div>
      <div className="prs-banner__visual" aria-hidden="true">
        <div className="prs-banner__orb" />
      </div>
    </div>
  )
}
