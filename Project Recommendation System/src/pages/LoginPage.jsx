import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../api'
import './auth.css'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/dashboard'

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api.auth.login(form)
      login(data.user, data.token)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__brand">
          <Link to="/" className="pm-brand" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <span style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--prs-primary)', display: 'inline-block' }} aria-hidden="true" />
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--prs-text)' }}>ProjectMatch</span>
          </Link>
        </div>

        <h1 className="auth-card__title">Welcome back</h1>
        <p className="auth-card__sub">Sign in to your account to continue</p>

        {error && <p className="auth-error" role="alert">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <label className="auth-label">
            Email address
            <input
              type="email"
              className="prs-input auth-input"
              value={form.email}
              onChange={set('email')}
              required
              autoComplete="email"
              autoFocus
            />
          </label>

          <label className="auth-label">
            Password
            <input
              type="password"
              className="prs-input auth-input"
              value={form.password}
              onChange={set('password')}
              required
              autoComplete="current-password"
            />
          </label>

          <button
            type="submit"
            className="prs-button prs-button--primary auth-submit"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="auth-card__footer">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="auth-link">Create one</Link>
        </p>
      </div>
    </div>
  )
}
