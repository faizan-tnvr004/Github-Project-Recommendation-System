/** Single source of truth for light/dark across marketing + app shell CSS. */

export const THEME_STORAGE_KEY = 'projectmatch-theme'
const LEGACY_PRS_KEY = 'prs-theme'

/** @returns {'light' | 'dark'} */
export function readStoredTheme() {
  if (typeof window === 'undefined') return 'light'
  let v = localStorage.getItem(THEME_STORAGE_KEY)
  if (v !== 'dark' && v !== 'light') {
    v = localStorage.getItem(LEGACY_PRS_KEY)
  }
  if (v === 'dark' || v === 'light') return v
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Sets `data-pm-theme` + `data-prs-theme` + persistence so Landing + prs-app stay aligned. */
export function applyThemeToDocument(theme) {
  if (typeof document === 'undefined') return
  const t = theme === 'dark' ? 'dark' : 'light'
  document.documentElement.dataset.pmTheme = t
  document.documentElement.dataset.prsTheme = t
  document.documentElement.style.colorScheme = t
  try {
    localStorage.setItem(THEME_STORAGE_KEY, t)
  } catch {
    /* private mode etc. */
  }
}
