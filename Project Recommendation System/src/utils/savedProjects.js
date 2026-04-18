const KEY = 'prs-saved-project-ids'

export function readSavedProjectIds() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    const parsed = JSON.parse(raw ?? '[]')
    if (!Array.isArray(parsed)) return []
    return parsed.filter((x) => typeof x === 'string')
  } catch {
    return []
  }
}

export function writeSavedProjectIds(ids) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(ids))
}

export function toggleSavedProjectId(id) {
  const prev = readSavedProjectIds()
  const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
  writeSavedProjectIds(next)
  return next
}