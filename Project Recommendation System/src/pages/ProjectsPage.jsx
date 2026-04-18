import { useMemo, useState } from "react";
import { ProjectCard } from "../components/project/ProjectCard";
import { categories, projects } from "../data/projects";

export function ProjectsPage() {
  const [active, setActive] = useState("All");

  const filtered = useMemo(() => {
    if (active === "All") return projects;
    return projects.filter((p) => p.category === active);
  }, [active]);

  return (
    <>
      <h1 className="prs-page-title">Projects</h1>
      <p className="prs-page-lead">
        Filter by discipline. Each card shows duration, team shape, and a match
        score derived from your preferences.
      </p>

      <div className="prs-filters" role="group" aria-label="Category">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            className={`prs-chip${c === active ? " prs-chip--active" : ""}`}
            onClick={() => setActive(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="prs-grid">
        {filtered.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="prs-page-lead">No projects in this category yet.</p>
      )}
    </>
  );
}
