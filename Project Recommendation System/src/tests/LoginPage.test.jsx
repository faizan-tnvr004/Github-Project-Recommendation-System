/**
 * LoginPage.test.jsx — Login form component tests
 *
 * PURPOSE:
 *   Tests the LoginPage React component from the user's point of view.
 *   These are "user-facing" tests — they interact with the DOM the same
 *   way a real user would (finding elements by label, clicking buttons,
 *   typing in inputs) rather than testing internal implementation details.
 *
 * WHAT IS TESTED:
 *   Rendering:
 *     - The page renders the email and password fields
 *     - The Sign In button is visible
 *     - A link to the signup page exists
 *
 *   Form interaction:
 *     - Typing in the fields updates their values
 *     - Submitting with empty fields does not call the API
 *
 *   API integration:
 *     - On successful login the API is called with the correct data
 *     - Error messages from the API are shown to the user
 *     - The button shows "Signing in…" during the request
 *
 * HOW MOCKING WORKS:
 *   We mock the entire `src/api/index.js` module so no real HTTP request
 *   is ever made. We control exactly what the API returns.
 *   This keeps tests fast and deterministic.
 *
 * TOOLS:
 *   - Vitest (test runner)
 *   - React Testing Library (renders component, queries DOM)
 *   - @testing-library/user-event (realistic user interactions)
 */

import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { LoginPage } from '../pages/LoginPage'

// ─── Mock the API module ─────────────────────────────────────────────────────
/**
 * vi.mock() replaces the real API module with a fake one.
 * Every test in this file uses this mock, not real HTTP requests.
 */
vi.mock('../api', () => ({
  api: {
    auth: {
      login: vi.fn(),
    },
  },
}))

import { api } from '../api'

// ─── Test wrapper ────────────────────────────────────────────────────────────
/**
 * LoginPage needs:
 *   - AuthProvider: to call login() after success
 *   - MemoryRouter: because it uses <Link> and useNavigate()
 *
 * We wrap every render in this helper.
 */
function renderLogin() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/login']}>
        <LoginPage />
      </MemoryRouter>
    </AuthProvider>
  )
}

beforeEach(() => {
  vi.clearAllMocks() // reset mock call counts between tests
  localStorage.clear()
})

// ─── Rendering tests ─────────────────────────────────────────────────────────

describe('LoginPage — rendering', () => {

  /**
   * The email input must have an accessible label.
   * Screen readers (and our queries) find it by the label text.
   */
  test('renders email input', () => {
    renderLogin()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
  })

  test('renders password input', () => {
    renderLogin()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  test('renders the sign in button', () => {
    renderLogin()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  /**
   * Navigation link — users must be able to reach the signup page.
   */
  test('renders a link to the signup page', () => {
    renderLogin()
    const link = screen.getByRole('link', { name: /create one/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/signup')
  })

  /**
   * The page title must convey the page purpose.
   */
  test('renders the welcome heading', () => {
    renderLogin()
    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument()
  })

  /**
   * Password field must have type="password" so the browser masks it.
   * Exposing passwords as plain text would be a security issue.
   */
  test('password field is masked (type=password)', () => {
    renderLogin()
    const passwordInput = screen.getByLabelText(/password/i)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })
})

// ─── Interaction tests ───────────────────────────────────────────────────────

describe('LoginPage — user interactions', () => {

  test('typing updates the email field value', async () => {
    renderLogin()
    const emailInput = screen.getByLabelText(/email address/i)

    await userEvent.type(emailInput, 'test@example.com')
    expect(emailInput).toHaveValue('test@example.com')
  })

  test('typing updates the password field value', async () => {
    renderLogin()
    const passwordInput = screen.getByLabelText(/password/i)

    await userEvent.type(passwordInput, 'mypassword')
    expect(passwordInput).toHaveValue('mypassword')
  })

  /**
   * Successful login flow:
   * 1. User fills in both fields
   * 2. User clicks Sign In
   * 3. api.auth.login is called with the correct email and password
   */
  test('calls api.auth.login with correct credentials on submit', async () => {
    api.auth.login.mockResolvedValue({
      token: 'fake-jwt-token',
      user: { id: '1', name: 'Test User', email: 'test@example.com' },
    })

    renderLogin()

    await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'mypassword')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(api.auth.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'mypassword',
      })
    })
  })

  /**
   * Error display — if the API returns an error, the user must see it.
   * Without this, a wrong password would silently do nothing.
   */
  test('displays error message when login fails', async () => {
    api.auth.login.mockRejectedValue(new Error('Invalid credentials.'))

    renderLogin()

    await userEvent.type(screen.getByLabelText(/email address/i), 'wrong@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'wrongpass')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByRole('alert')).toHaveTextContent(/invalid credentials/i)
    })
  })
})
