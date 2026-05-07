import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { readSavedProjectIds } from '../utils/savedProjects'

function Avatar({ name }) {
  const initials = name
    ? name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'
  return (
    <div style={{
      width: '4.5rem', height: '4.5rem', borderRadius: '50%',
      background: 'var(--prs-primary)', color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '1.5rem', fontWeight: 700, flexShrink: 0,
      boxShadow: 'var(--prs-glow)',
    }} aria-hidden="true">
      {initials}
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', padding: '0.85rem 1rem', borderBottom: '1px solid var(--prs-border)' }}>
      <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--prs-muted)' }}>
        {label}
      </span>
      <span style={{ fontSize: '0.9375rem', color: 'var(--prs-text)', fontWeight: 500 }}>{value}</span>
    </div>
  )
}

export function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const savedCount = readSavedProjectIds().length

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const joinedDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <>
      <h1 className="prs-page-title">Profile</h1>
      <p className="prs-page-lead">Your account information.</p>

      <div style={{ maxWidth: 540 }}>
        {/* Avatar + name */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '1.25rem',
          padding: '1.5rem', marginBottom: '1.5rem',
          background: 'var(--prs-surface)', borderRadius: 'var(--prs-radius)',
          border: '1px solid var(--prs-border)', boxShadow: 'var(--prs-shadow-sm)',
        }}>
          <Avatar name={user?.name} />
          <div>
            <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--prs-text)' }}>
              {user?.name ?? '—'}
            </p>
            <p style={{ margin: '0.15rem 0 0', fontSize: '0.875rem', color: 'var(--prs-muted)' }}>
              {user?.email ?? '—'}
            </p>
          </div>
        </div>

        {/* Details card */}
        <div style={{
          background: 'var(--prs-surface)', borderRadius: 'var(--prs-radius)',
          border: '1px solid var(--prs-border)', overflow: 'hidden',
          boxShadow: 'var(--prs-shadow-sm)', marginBottom: '1.5rem',
        }}>
          <InfoRow label="Full name"       value={user?.name  ?? '—'} />
          <InfoRow label="Email address"   value={user?.email ?? '—'} />
          <InfoRow label="Saved projects"  value={savedCount} />
          <InfoRow label="Member since"    value={joinedDate} />
          <div style={{ padding: '0.85rem 1rem' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--prs-muted)' }}>
              Account ID
            </span>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: 'var(--prs-muted)', fontFamily: 'monospace', wordBreak: 'break-all' }}>
              {user?.id ?? '—'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <button
          type="button"
          onClick={handleLogout}
          style={{
            padding: '0.6rem 1.25rem', borderRadius: '0.65rem',
            border: '1px solid rgba(220,38,38,0.3)',
            background: 'rgba(220,38,38,0.06)', color: '#dc2626',
            fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
          }}
        >
          Sign out
        </button>
      </div>
    </>
  )
}
