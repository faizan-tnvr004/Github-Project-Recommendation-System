import { Link } from "react-router-dom";
import { RecommendationBanner } from "../components/project/RecommendationBanner";
import { ProjectCard } from "../components/project/ProjectCard";
import { getRecommended, projects } from "../data/projects";
import FAQSection from "../components/landing/FAQSection";

export function HomePage() {
  const top = getRecommended(3);

  return (
    <>
      <h1 className="prs-page-title">Overview</h1>
      <p className="prs-page-lead">
        Curated project briefs ranked for your team. Start from top matches or
        browse the full catalog.
      </p>

      <div className="prs-stats" aria-label="Summary">
        <div className="prs-stat">
          <span className="prs-stat__value">{projects.length}</span>
          <span className="prs-stat__label">Active briefs</span>
        </div>
        <div className="prs-stat">
          <span className="prs-stat__value">94%</span>
          <span className="prs-stat__label">Avg. fit (top 5)</span>
        </div>
        <div className="prs-stat">
          <span className="prs-stat__value">12</span>
          <span className="prs-stat__label">Saved this week</span>
        </div>
      </div>

      <RecommendationBanner />

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        <h2
          className="prs-page-title"
          style={{ margin: 0, fontSize: "1.15rem" }}
        >
          Top matches
        </h2>
        <Link to="/projects" className="prs-button prs-button--ghost">
          Browse all
        </Link>
      </div>

      <div className="prs-grid prs-grid--tight">
        {top.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>

      <div style={{ marginTop: "4rem" }}>
        <FAQSection />
      </div>
    </>
  );
}
