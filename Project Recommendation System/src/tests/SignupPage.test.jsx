/**
 * SignupPage.test.jsx — Signup form component tests
 *
 * PURPOSE:
 *   Tests the SignupPage component with a focus on form validation.
 *   Signup has more client-side validation than login (password match,
 *   minimum length), so there are more edge cases to cover.
 *
 * WHAT IS TESTED:
 *   Rendering:
 *     - All four fields render (name, email, password, confirm password)
 *     - The Create Account button renders
 *     - A link back to login exists
 *
 *   Validation (happens BEFORE calling the API):
 *     - Mismatched passwords show an error and do NOT call the API
 *     - Password shorter than 6 characters is rejected
 *     - Matching, long-enough passwords do call the API
 *
 *   API integration:
 *     - On successful registration the API is called with name, email, password
 *     - API error messages are shown to the user
 *
 * KEY TESTING CONCEPT — testing validation client-side:
 *   We check that api.auth.register was NOT called when validation fails.
 *   This confirms the validation runs before the network request,
 *   saving unnecessary API calls and giving instant feedback.
 */

import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { SignupPage } from '../pages/SignupPage'

vi.mock('../api', () => ({
  api: {
    auth: {
      register: vi.fn(),
    },
  },
}))

import { api } from '../api'

function renderSignup() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/signup']}>
        <SignupPage />
      </MemoryRouter>
    </AuthProvider>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
})

// ─── Rendering ───────────────────────────────────────────────────────────────

describe('SignupPage — rendering', () => {

  test('renders all four input fields', () => {
    renderSignup()
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    // Get the two password fields — query all and pick by index
    const passwordFields = screen.getAllByLabelText(/password/i)
    expect(passwordFields.length).toBeGreaterThanOrEqual(2)
  })

  test('renders the create account button', () => {
    renderSignup()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  test('renders a link back to the login page', () => {
    renderSignup()
    const link = screen.getByRole('link', { name: /sign in/i })
    expect(link).toHaveAttribute('href', '/login')
  })

  test('renders the page heading', () => {
    renderSignup()
    expect(screen.getByRole('heading', { name: /create your account/i })).toBeInTheDocument()
  })
})

// ─── Validation tests ─────────────────────────────────────────────────────────

describe('SignupPage — client-side validation', () => {

  /**
   * Password mismatch — the most important validation.
   * Without this, a user could accidentally set the wrong password.
   */
  test('shows error when passwords do not match', async () => {
    renderSignup()

    await userEvent.type(screen.getByLabelText(/full name/i), 'Test User')
    await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com')

    const [passwordField, confirmField] = screen.getAllByLabelText(/password/i)
    await userEvent.type(passwordField, 'password123')
    await userEvent.type(confirmField, 'differentpass')

    await userEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/do not match/i)
    })
  })

  /**
   * Mismatch must NOT call the API — the request should never be made.
   */
  test('does NOT call the API when passwords do not match', async () => {
    renderSignup()

    await userEvent.type(screen.getByLabelText(/full name/i), 'Test')
    await userEvent.type(screen.getByLabelText(/email address/i), 'test@test.com')
    const [pw, confirm] = screen.getAllByLabelText(/password/i)
    await userEvent.type(pw, 'abc123')
    await userEvent.type(confirm, 'xyz789')
    await userEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(api.auth.register).not.toHaveBeenCalled()
    })
  })

  /**
   * Short password — under 6 characters is too weak.
   */
  test('shows error when password is shorter than 6 characters', async () => {
    renderSignup()

    await userEvent.type(screen.getByLabelText(/full name/i), 'Test User')
    await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com')
    const [pw, confirm] = screen.getAllByLabelText(/password/i)
    await userEvent.type(pw, '123')
    await userEvent.type(confirm, '123')
    await userEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/at least 6/i)
    })
  })

  test('does NOT call the API when password is too short', async () => {
    renderSignup()

    await userEvent.type(screen.getByLabelText(/full name/i), 'Test')
    await userEvent.type(screen.getByLabelText(/email address/i), 'a@b.com')
    const [pw, confirm] = screen.getAllByLabelText(/password/i)
    await userEvent.type(pw, '123')
    await userEvent.type(confirm, '123')
    await userEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(api.auth.register).not.toHaveBeenCalled()
    })
  })

  /**
   * Happy path — valid data with matching passwords calls the API.
   */
  test('calls api.auth.register with name, email, password on valid submit', async () => {
    api.auth.register.mockResolvedValue({
      token: 'new-jwt-token',
      user: { id: '99', name: 'New User', email: 'new@example.com' },
    })

    renderSignup()

    await userEvent.type(screen.getByLabelText(/full name/i), 'New User')
    await userEvent.type(screen.getByLabelText(/email address/i), 'new@example.com')
    const [pw, confirm] = screen.getAllByLabelText(/password/i)
    await userEvent.type(pw, 'validpassword')
    await userEvent.type(confirm, 'validpassword')
    await userEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(api.auth.register).toHaveBeenCalledWith({
        name: 'New User',
        email: 'new@example.com',
        password: 'validpassword',
      })
    })
  })

  /**
   * API error — e.g. duplicate email — must be shown to the user.
   */
  test('shows API error message to the user', async () => {
    api.auth.register.mockRejectedValue(new Error('An account with this email already exists.'))

    renderSignup()

    await userEvent.type(screen.getByLabelText(/full name/i), 'Dupe')
    await userEvent.type(screen.getByLabelText(/email address/i), 'dupe@example.com')
    const [pw, confirm] = screen.getAllByLabelText(/password/i)
    await userEvent.type(pw, 'password123')
    await userEvent.type(confirm, 'password123')
    await userEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/already exists/i)
    })
  })
})
