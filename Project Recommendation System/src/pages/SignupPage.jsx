import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../api'
import './auth.css'

export function SignupPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      const data = await api.auth.register({
        name: form.name,
        email: form.email,
        password: form.password,
      })
      login(data.user, data.token)
      navigate('/dashboard', { replace: true })
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
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <span style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--prs-primary)', display: 'inline-block' }} aria-hidden="true" />
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--prs-text)' }}>ProjectMatch</span>
          </Link>
        </div>

        <h1 className="auth-card__title">Create your account</h1>
        <p className="auth-card__sub">Start matching with projects in minutes</p>

        {error && <p className="auth-error" role="alert">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <label className="auth-label">
            Full name
            <input
              type="text"
              className="prs-input auth-input"
              value={form.name}
              onChange={set('name')}
              required
              autoComplete="name"
              autoFocus
            />
          </label>

          <label className="auth-label">
            Email address
            <input
              type="email"
              className="prs-input auth-input"
              value={form.email}
              onChange={set('email')}
              required
              autoComplete="email"
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
              minLength={6}
              autoComplete="new-password"
            />
          </label>

          <label className="auth-label">
            Confirm password
            <input
              type="password"
              className="prs-input auth-input"
              value={form.confirm}
              onChange={set('confirm')}
              required
              autoComplete="new-password"
            />
          </label>

          <button
            type="submit"
            className="prs-button prs-button--primary auth-submit"
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-card__footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
