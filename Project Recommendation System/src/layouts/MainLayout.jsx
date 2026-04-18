import { useCallback, useEffect, useMemo, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AppHeader } from '../components/layout/AppHeader'
import { AppSidebar } from '../components/layout/AppSidebar'
import './MainLayout.css'

const THEME_KEY = 'prs-theme'

function readStoredTheme() {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem(THEME_KEY)
  if (stored === 'dark' || stored === 'light') return stored
  return 'light'
}

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [theme, setTheme] = useState(readStoredTheme)

  const closeSidebar = useCallback(() => setSidebarOpen(false), [])
  const toggleSidebar = useCallback(() => setSidebarOpen((o) => !o), [])

  const toggleTheme = useMemo(() => {
    return () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeSidebar()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeSidebar])

  useEffect(() => {
    document.body.classList.toggle('prs-no-scroll', sidebarOpen)
    return () => document.body.classList.remove('prs-no-scroll')
  }, [sidebarOpen])

  useEffect(() => {
    document.documentElement.dataset.prsTheme = theme
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    const root = document.getElementById('root')
    if (!root) return
    root.classList.add('prs-root')
    return () => root.classList.remove('prs-root')
  }, [])

  return (
    <div className="prs-shell">
      <div
        className={`prs-backdrop${sidebarOpen ? ' prs-backdrop--visible' : ''}`}
        aria-hidden="true"
        onClick={closeSidebar}
      />
      <div id="prs-sidebar-panel" className={`prs-sidebar-wrap${sidebarOpen ? ' prs-sidebar-wrap--open' : ''}`}>
        <AppSidebar
          onNavigate={closeSidebar}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      </div>
      <div className="prs-main">
        <AppHeader onMenuClick={toggleSidebar} menuOpen={sidebarOpen} />
        <main className="prs-content" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
