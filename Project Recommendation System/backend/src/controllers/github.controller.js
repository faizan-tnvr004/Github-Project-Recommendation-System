import { asyncHandler } from "../utils/asyncHandler.js";

const GITHUB_API = "https://api.github.com";

function githubHeaders() {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

/**
 * Scores a GitHub repository on a 0-100 scale using several independent signals:
 *
 * 1. Popularity   (25 pts) – stars, forks, watchers (log-scaled so megarepos don't dominate)
 * 2. Documentation(20 pts) – description length, wiki, pages, topics, homepage
 * 3. Maintenance  (20 pts) – recency of last push (decays quickly for stale repos)
 * 4. Community    (10 pts) – open issues as a proxy for active engagement
 * 5. Contributor  (10 pts) – beginner-friendly signals: good-first-issue topic, CONTRIBUTING hint
 * 6. Trustworthiness(10 pts) – license present, repo age (stability signal)
 * 7. Code health  (5 pts)  – reasonable codebase size (not a skeleton, not a monolith dump)
 */
function scoreRepo(repo) {
  let score = 0;

  // ── 1. Popularity (max 25) ──────────────────────────────────────────────────
  score += Math.min(10, Math.log10(repo.stargazers_count + 1) * 3.5);
  score += Math.min(8, Math.log10(repo.forks_count + 1) * 3.0);
  score += Math.min(7, Math.log10(repo.watchers_count + 1) * 2.5);

  // ── 2. Documentation quality (max 20) ──────────────────────────────────────
  const desc = repo.description || "";
  if (desc.length > 120) score += 7;
  else if (desc.length > 50) score += 4;
  else if (desc.length > 0) score += 1;

  if (repo.has_wiki) score += 3;
  if (repo.has_pages) score += 4;

  const topicCount = repo.topics?.length ?? 0;
  if (topicCount >= 5) score += 4;
  else if (topicCount >= 2) score += 2;
  else if (topicCount >= 1) score += 1;

  if (repo.homepage) score += 2;

  // ── 3. Maintenance & recency (max 20) ──────────────────────────────────────
  const daysSincePush =
    (Date.now() - new Date(repo.pushed_at).getTime()) / 86_400_000;
  if (daysSincePush < 7) score += 20;
  else if (daysSincePush < 30) score += 16;
  else if (daysSincePush < 90) score += 11;
  else if (daysSincePush < 180) score += 6;
  else if (daysSincePush < 365) score += 2;

  // ── 4. Community engagement (max 10) ───────────────────────────────────────
  // Open issues signal an active, used project
  const issues = repo.open_issues_count;
  if (issues > 200) score += 10;
  else if (issues > 50) score += 7;
  else if (issues > 10) score += 4;
  else if (issues > 0) score += 2;

  // ── 5. Contributor-friendliness (max 10) ────────────────────────────────────
  const topics = repo.topics ?? [];
  if (topics.includes("good-first-issue") || topics.includes("hacktoberfest"))
    score += 5;
  if (topics.includes("open-source") || topics.includes("contributions-welcome"))
    score += 3;
  // Repo that explicitly advertises contribution opportunities gets bonus
  if (topics.includes("contributing") || topics.includes("beginner-friendly"))
    score += 2;

  // ── 6. Trustworthiness (max 10) ────────────────────────────────────────────
  if (repo.license) score += 5;

  const ageYears =
    (Date.now() - new Date(repo.created_at).getTime()) / (365 * 86_400_000);
  if (ageYears > 4) score += 5;
  else if (ageYears > 2) score += 3;
  else if (ageYears > 1) score += 1;

  // ── 7. Code health (max 5) ──────────────────────────────────────────────────
  // Ideal size: 50 KB – 50 MB (size is in KB in GitHub API)
  if (repo.size >= 50 && repo.size <= 50_000) score += 5;
  else if (repo.size > 10) score += 2;

  // Archived repos are penalised heavily – they won't get new contributions
  if (repo.archived) score = Math.floor(score * 0.25);

  return Math.round(Math.min(100, score));
}

function normaliseRepo(repo) {
  return {
    id: `gh-${repo.id}`,
    githubId: repo.id,
    title: repo.full_name,
    name: repo.name,
    tagline: repo.description || "No description provided.",
    tech: (repo.topics ?? []).slice(0, 6),
    language: repo.language,
    category: repo.language || "Other",
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    openIssues: repo.open_issues_count,
    license: repo.license?.spdx_id ?? null,
    githubUrl: repo.html_url,
    homepage: repo.homepage || null,
    lastPushed: repo.pushed_at,
    createdAt: repo.created_at,
    archived: repo.archived,
    score: scoreRepo(repo),
    isGithub: true,
  };
}

export const searchGithubProjects = asyncHandler(async (req, res) => {
  const q = String(req.query?.q || "").trim();
  const lang = String(req.query?.lang || "").trim();
  const limitRaw = Number(req.query?.limit) || 20;
  const limit = Math.max(1, Math.min(50, limitRaw));

  if (!q) {
    return res.status(400).json({ ok: false, error: "Query parameter 'q' is required." });
  }

  let queryStr = q;
  if (lang) queryStr += `+language:${lang}`;

  const url = `${GITHUB_API}/search/repositories?q=${encodeURIComponent(queryStr)}&sort=stars&order=desc&per_page=${Math.min(limit * 2, 50)}`;

  const ghRes = await fetch(url, { headers: githubHeaders() });

  if (!ghRes.ok) {
    const errBody = await ghRes.text();
    return res.status(ghRes.status).json({
      ok: false,
      error: "GitHub API error",
      detail: errBody,
    });
  }

  const ghData = await ghRes.json();
  const repos = (ghData.items ?? [])
    .map(normaliseRepo)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  res.json({ ok: true, total: ghData.total_count, repos });
});

export const getGithubRecommended = asyncHandler(async (req, res) => {
  const lang = String(req.query?.lang || "").trim();
  const limitRaw = Number(req.query?.limit) || 10;
  const limit = Math.max(1, Math.min(30, limitRaw));

  // Broad query that surfaces quality, well-maintained open-source projects
  let queryStr = "stars:>500 pushed:>2024-01-01 is:public archived:false";
  if (lang) queryStr += ` language:${lang}`;

  const url = `${GITHUB_API}/search/repositories?q=${encodeURIComponent(queryStr)}&sort=stars&order=desc&per_page=40`;

  const ghRes = await fetch(url, { headers: githubHeaders() });

  if (!ghRes.ok) {
    const errBody = await ghRes.text();
    return res.status(ghRes.status).json({ ok: false, error: "GitHub API error", detail: errBody });
  }

  const ghData = await ghRes.json();
  const repos = (ghData.items ?? [])
    .map(normaliseRepo)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  res.json({ ok: true, repos });
});
