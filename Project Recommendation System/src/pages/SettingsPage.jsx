import { useState } from 'react'
import { applyThemeToDocument, readStoredTheme } from '../utils/theme'

function SettingRow({ label, description, children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: '1rem', padding: '1rem',
      borderBottom: '1px solid var(--prs-border)',
    }}>
      <div style={{ minWidth: 0 }}>
        <p style={{ margin: 0, fontWeight: 600, color: 'var(--prs-text)', fontSize: '0.9375rem' }}>{label}</p>
        {description && (
          <p style={{ margin: '0.15rem 0 0', fontSize: '0.8125rem', color: 'var(--prs-muted)' }}>{description}</p>
        )}
      </div>
      {children}
    </div>
  )
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      style={{
        width: '2.75rem', height: '1.5rem', borderRadius: '999px', flexShrink: 0,
        background: checked ? 'var(--prs-primary)' : 'var(--prs-border)',
        border: 'none', cursor: 'pointer', position: 'relative',
        transition: 'background 0.2s ease',
      }}
    >
      <span style={{
        position: 'absolute', top: '0.2rem',
        left: checked ? 'calc(100% - 1.3rem)' : '0.2rem',
        width: '1.1rem', height: '1.1rem', borderRadius: '50%',
        background: '#fff', transition: 'left 0.2s ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  )
}

export function SettingsPage() {
  const [theme, setTheme] = useState(() => readStoredTheme())
  const [emailNotifs, setEmailNotifs] = useState(false)
  const [compactView, setCompactView] = useState(false)

  const handleThemeToggle = (isDark) => {
    const next = isDark ? 'dark' : 'light'
    setTheme(next)
    applyThemeToDocument(next)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: 560 }}>
      <h1 className="prs-page-title" style={{ textAlign: 'center' }}>Settings</h1>
      <p className="prs-page-lead" style={{ textAlign: 'center' }}>Manage your app preferences.</p>

      <div>
        {/* Appearance */}
        <h2 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--prs-muted)', margin: '0 0 0.5rem' }}>
          Appearance
        </h2>
        <div style={{ background: 'var(--prs-surface)', borderRadius: 'var(--prs-radius)', border: '1px solid var(--prs-border)', overflow: 'hidden', boxShadow: 'var(--prs-shadow-sm)', marginBottom: '1.5rem' }}>
          <SettingRow label="Dark mode" description="Switch between light and dark theme">
            <Toggle checked={theme === 'dark'} onChange={handleThemeToggle} label="Toggle dark mode" />
          </SettingRow>
          <SettingRow label="Compact view" description="Show more projects with less spacing">
            <Toggle checked={compactView} onChange={setCompactView} label="Toggle compact view" />
          </SettingRow>
        </div>

        {/* Notifications */}
        <h2 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--prs-muted)', margin: '0 0 0.5rem' }}>
          Notifications
        </h2>
        <div style={{ background: 'var(--prs-surface)', borderRadius: 'var(--prs-radius)', border: '1px solid var(--prs-border)', overflow: 'hidden', boxShadow: 'var(--prs-shadow-sm)', marginBottom: '1.5rem' }}>
          <SettingRow label="Email notifications" description="Receive weekly project recommendations by email">
            <Toggle checked={emailNotifs} onChange={setEmailNotifs} label="Toggle email notifications" />
          </SettingRow>
        </div>

        {/* About */}
        <h2 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--prs-muted)', margin: '0 0 0.5rem' }}>
          About
        </h2>
        <div style={{ background: 'var(--prs-surface)', borderRadius: 'var(--prs-radius)', border: '1px solid var(--prs-border)', overflow: 'hidden', boxShadow: 'var(--prs-shadow-sm)' }}>
          <SettingRow label="Version" description={null}>
            <span style={{ fontSize: '0.875rem', color: 'var(--prs-muted)', fontFamily: 'monospace' }}>1.0.0</span>
          </SettingRow>
          <SettingRow label="GitHub API" description="Projects fetched live from GitHub">
            <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '999px', background: 'rgba(13,159,110,0.1)', color: 'var(--prs-success)', fontWeight: 600 }}>
              Live
            </span>
          </SettingRow>
        </div>
      </div>
      </div>
    </div>
  )
}
