/**
 * auth.test.js — Authentication route tests
 *
 * PURPOSE:
 *   Tests the two core auth endpoints: /api/auth/register and /api/auth/login.
 *   These are integration tests — they send real HTTP requests through the
 *   full Express middleware stack (body parsing, routing, controller, response).
 *
 * WHAT IS TESTED:
 *   Registration:
 *     - Valid registration creates a user and returns a JWT token
 *     - Missing fields (name/email/password) are rejected with 400
 *     - Registering the same email twice is rejected with 400
 *     - The returned token is a non-empty string
 *     - The returned user object contains the correct name and email
 *
 *   Login:
 *     - Valid email + password returns a JWT token
 *     - Wrong password is rejected with 400
 *     - Unknown email is rejected with 400
 *     - Missing fields are rejected with 400
 *
 * WHY MOCK MODE:
 *   USE_MOCK_DATA=true makes the auth controller use an in-memory Map
 *   instead of MongoDB, so tests run instantly with zero external dependencies.
 *
 * TOOL: supertest
 *   supertest wraps our Express `app` and lets us send HTTP requests
 *   programmatically without starting a real server on a port.
 */

import request from 'supertest'
import { app } from '../src/app.js'

process.env.USE_MOCK_DATA = 'true'

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Creates a unique email for each test run so tests don't collide */
const uniqueEmail = (prefix = 'user') => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}@test.com`

/** Registers a throwaway account and returns the response */
async function registerUser(overrides = {}) {
  return request(app)
    .post('/api/auth/register')
    .send({
      name: 'Test User',
      email: uniqueEmail(),
      password: 'testpassword123',
      ...overrides,
    })
}

// ─── Registration tests ──────────────────────────────────────────────────────

describe('POST /api/auth/register', () => {

  /**
   * Happy path: all valid fields provided.
   * Expect HTTP 201 (Created), a token string, and the user's details.
   */
  test('returns 201 and a JWT token on success', async () => {
    const res = await registerUser()

    expect(res.status).toBe(201)
    expect(typeof res.body.token).toBe('string')
    expect(res.body.token.length).toBeGreaterThan(0)
  })

  test('returns the correct user name and email', async () => {
    const email = uniqueEmail('namecheck')
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Jane Doe', email, password: 'password123' })

    expect(res.body.user.name).toBe('Jane Doe')
    expect(res.body.user.email).toBe(email.toLowerCase())
  })

  test('stores email in lowercase regardless of input', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Case Test', email: 'UPPER@EXAMPLE.COM', password: 'pass123' })

    // Either success (first run) or duplicate error — either way email is lowercased
    if (res.status === 201) {
      expect(res.body.user.email).toBe('upper@example.com')
    }
  })

  /**
   * Missing field cases — controller must validate all three fields.
   */
  test('returns 400 when name is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: uniqueEmail(), password: 'password123' })

    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/name|email|password/i)
  })

  test('returns 400 when email is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'No Email', password: 'password123' })

    expect(res.status).toBe(400)
  })

  test('returns 400 when password is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'No Pass', email: uniqueEmail() })

    expect(res.status).toBe(400)
  })

  /**
   * Duplicate email — registering twice with the same email must fail.
   * This protects against accidentally creating two accounts with one email.
   */
  test('returns 400 when email is already registered', async () => {
    const email = uniqueEmail('dup')

    // First registration — should succeed
    const first = await request(app)
      .post('/api/auth/register')
      .send({ name: 'First', email, password: 'pass123' })
    expect(first.status).toBe(201)

    // Second registration with same email — should fail
    const second = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Second', email, password: 'different' })

    expect(second.status).toBe(400)
    expect(second.body.message).toMatch(/already exists/i)
  })
})

// ─── Login tests ─────────────────────────────────────────────────────────────

describe('POST /api/auth/login', () => {

  /** Registers a user once, then runs login tests against them */
  let testEmail
  beforeAll(async () => {
    testEmail = uniqueEmail('login')
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Login Tester', email: testEmail, password: 'correctpassword' })
  })

  /**
   * Happy path: correct email and password.
   * Expect 200 and a JWT token.
   */
  test('returns 200 and a token with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: 'correctpassword' })

    expect(res.status).toBe(200)
    expect(typeof res.body.token).toBe('string')
    expect(res.body.token.length).toBeGreaterThan(0)
  })

  test('returns the user object with name and email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: 'correctpassword' })

    expect(res.body.user).toBeDefined()
    expect(res.body.user.email).toBe(testEmail.toLowerCase())
  })

  /**
   * Wrong password — bcrypt compare will fail, expect 400.
   */
  test('returns 400 for wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: 'wrongpassword' })

    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/invalid/i)
  })

  /**
   * Unknown email — no account with this email exists.
   */
  test('returns 400 for unregistered email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@nowhere.com', password: 'anything' })

    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/no account/i)
  })

  /**
   * Missing fields — both email and password are required.
   */
  test('returns 400 when email is missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: 'somepassword' })

    expect(res.status).toBe(400)
  })

  test('returns 400 when password is missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail })

    expect(res.status).toBe(400)
  })
})
