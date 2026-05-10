/**
 * GitHub API service — searches repos and maps them to the internal Project shape.
 *
 * Requires GITHUB_TOKEN in .env for higher rate limits (5 000 req/h vs 10 req/min).
 * Falls back to unauthenticated requests if not set.
 */

const GITHUB_API = "https://api.github.com";

/**
 * Build request headers – adds Authorization if a token is available.
 */
function headers() {
  const h = {
    Accept: "application/vnd.github+json",
    "User-Agent": "ProjectRecommendationSystem/1.0",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

/**
 * Map a raw GitHub repo object → internal Project shape.
 */
function mapRepoToProject(repo) {
  // Derive a simple "category" from GitHub topics / language
  const lang = (repo.language || "").toLowerCase();
  let category = "Web";
  if (["python", "r", "julia", "jupyter notebook"].includes(lang)) category = "Data";
  if (repo.topics?.some((t) => ["data", "ml", "machine-learning", "data-science", "ai"].includes(t)))
    category = "Data";

  // Derive a difficulty level from stargazers + forks
  let level = "Beginner";
  if (repo.stargazers_count > 500 || repo.forks_count > 100) level = "Intermediate";
  if (repo.stargazers_count > 5000 || repo.forks_count > 1000) level = "Advanced";

  // Compute a synthetic match score (0–100) based on stars, recency, and completeness
  const stars = Math.min(repo.stargazers_count, 10000);
  const starScore = (stars / 10000) * 40;
  const hasReadme = repo.has_wiki || repo.description ? 15 : 0;
  const recentPush = new Date(repo.pushed_at) > new Date(Date.now() - 180 * 86400000) ? 20 : 5;
  const topicScore = Math.min((repo.topics?.length || 0) * 5, 25);
  const matchScore = Math.round(Math.min(starScore + hasReadme + recentPush + topicScore, 100));

  return {
    id: `gh-${repo.id}`,
    title: repo.full_name,
    tagline: repo.description || "No description provided",
    category,
    level,
    matchScore,
    duration: level === "Advanced" ? "4–8 weeks" : level === "Intermediate" ? "2–4 weeks" : "1–2 weeks",
    teamSize: level === "Advanced" ? "3–5" : level === "Intermediate" ? "2–3" : "1–2",
    forks: repo.forks_count,
    tech: [repo.language, ...(repo.topics || []).slice(0, 5)].filter(Boolean),
    description: repo.description || "No description available.",
    highlights: [
      `⭐ ${repo.stargazers_count.toLocaleString()} stars`,
      `🍴 ${repo.forks_count.toLocaleString()} forks`,
      repo.license?.spdx_id ? `📄 ${repo.license.spdx_id} license` : "📄 No license specified",
    ],
    githubUrl: repo.html_url,
    owner: {
      login: repo.owner?.login,
      avatar: repo.owner?.avatar_url,
    },
  };
}

/**
 * Search GitHub repositories.
 *
 * @param {string} query      Search terms (e.g. "react todo app")
 * @param {string} [language] Filter by primary language (e.g. "javascript")
 * @param {string} [sort]     "stars" | "forks" | "updated" | "best-match" (default)
 * @param {number} [limit=20] Max results (1–100)
 * @returns {Promise<{ projects: object[], total: number }>}
 */
export async function searchGitHubRepos(query, { language, sort = "stars", limit = 20 } = {}) {
  let q = query;
  if (language) q += ` language:${language}`;

  const params = new URLSearchParams({
    q,
    sort: sort === "best-match" ? "" : sort,
    order: "desc",
    per_page: String(Math.min(Math.max(limit, 1), 100)),
  });

  const res = await fetch(`${GITHUB_API}/search/repositories?${params}`, { headers: headers() });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg = body.message || `GitHub API returned ${res.status}`;
    const err = new Error(msg);
    err.status = res.status === 403 ? 429 : res.status; // 403 from GitHub = rate-limited
    throw err;
  }

  const data = await res.json();

  return {
    total: data.total_count ?? 0,
    projects: (data.items || []).map(mapRepoToProject),
  };
}

/**
 * Fetch trending repos (most-starred repos created in the last 30 days).
 *
 * @param {string} [language]
 * @param {number} [limit=10]
 */
export async function getTrendingRepos({ language, limit = 10 } = {}) {
  const since = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
  let q = `created:>${since} stars:>50`;
  if (language) q += ` language:${language}`;

  return searchGitHubRepos(q, { language: null, sort: "stars", limit });
}
