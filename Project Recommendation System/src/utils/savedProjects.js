const IDS_KEY  = 'prs-saved-project-ids'
const DATA_KEY = 'prs-saved-github-repos'

/* ── IDs (used for quick "is saved?" checks) ─────────────── */

export function readSavedProjectIds() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(IDS_KEY)
    const parsed = JSON.parse(raw ?? '[]')
    if (!Array.isArray(parsed)) return []
    return parsed.filter((x) => typeof x === 'string')
  } catch {
    return []
  }
}

function writeSavedProjectIds(ids) {
  if (typeof window === 'undefined') return
  localStorage.setItem(IDS_KEY, JSON.stringify(ids))
}

/* ── GitHub repo data store ──────────────────────────────── */

function readSavedRepos() {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(DATA_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function writeSavedRepos(map) {
  if (typeof window === 'undefined') return
  localStorage.setItem(DATA_KEY, JSON.stringify(map))
}

export function readSavedGithubRepos() {
  return Object.values(readSavedRepos())
}

/* ── Toggle helpers ──────────────────────────────────────── */

/**
 * Toggle a GitHub repo in/out of saved.
 * Pass the full repo object (must have `.id`).
 * Returns the new IDs array.
 */
export function toggleSavedProject(repo) {
  const id   = typeof repo === 'string' ? repo : repo.id
  const prev = readSavedProjectIds()
  const isSaved = prev.includes(id)
  const next = isSaved ? prev.filter(x => x !== id) : [...prev, id]
  writeSavedProjectIds(next)

  // Keep repo data in sync (only for GitHub repos)
  if (typeof repo === 'object' && repo.isGithub) {
    const map = readSavedRepos()
    if (isSaved) delete map[id]
    else map[id] = repo
    writeSavedRepos(map)
  }

  return next
}

/**
 * Legacy helper — kept so existing callers (ProjectCard) still work.
 * Only works with plain IDs (local mock projects).
 */
export function toggleSavedProjectId(id) {
  return toggleSavedProject(id)
}
