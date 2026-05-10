/**
 * health.test.js — Server health & root endpoint tests
 *
 * PURPOSE:
 *   The simplest tests in the suite. They verify the server is running
 *   and responding correctly before any real feature tests run.
 *   If these fail, everything else will fail too — so they act as a
 *   "smoke test" (quick sanity check that the app starts at all).
 *
 * WHAT IS TESTED:
 *   - GET /         → confirms the backend is alive and returns a JSON payload
 *   - GET /health   → confirms the health endpoint returns uptime information
 *
 * WHY NO DATABASE IS NEEDED:
 *   We set USE_MOCK_DATA=true so Mongoose never tries to connect.
 *   These routes don't touch the database anyway.
 */

import request from 'supertest'
import { app } from '../src/app.js'

// Force mock mode globally for ALL backend tests in this file.
// This prevents Mongoose from attempting a real MongoDB connection.
process.env.USE_MOCK_DATA = 'true'

describe('Server Health', () => {

  /**
   * Test 1: Root route
   * Checks that the server responds to GET / with a 200 status
   * and a JSON body that includes { ok: true }.
   * This confirms Express is configured and routing works.
   */
  test('GET / returns 200 with ok:true', async () => {
    const res = await request(app).get('/')

    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(res.body.service).toBe('backend')
  })

  /**
   * Test 2: Health endpoint
   * Checks that /health returns runtime information.
   * The 'uptime' field confirms the Node.js process has been running,
   * and 'timestamp' confirms the response is generated dynamically.
   */
  test('GET /health returns uptime and timestamp', async () => {
    const res = await request(app).get('/health')

    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(typeof res.body.uptime).toBe('number')
    expect(typeof res.body.timestamp).toBe('string')
  })

  /**
   * Test 3: 404 for unknown routes
   * Any request to a route that doesn't exist should return 404.
   * This confirms the notFound middleware is wired up correctly.
   */
  test('GET /nonexistent returns 404', async () => {
    const res = await request(app).get('/nonexistent-route-xyz')

    expect(res.status).toBe(404)
  })

  /**
   * Test 4: API root
   * The /api base route should confirm the API is reachable.
   */
  test('GET /api returns 200', async () => {
    const res = await request(app).get('/api')

    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
  })
})
