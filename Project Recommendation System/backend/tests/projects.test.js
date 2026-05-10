/**
 * projects.test.js — Project API route tests
 *
 * PURPOSE:
 *   Tests the three project endpoints that serve mock project data
 *   to the frontend dashboard and project pages.
 *
 * WHAT IS TESTED:
 *   GET /api/projects
 *     - Returns a list of all projects
 *     - Each project has the expected shape (id, title, matchScore, etc.)
 *     - Category filter (?category=Web) returns only matching projects
 *     - Unknown category returns an empty array (not an error)
 *
 *   GET /api/projects/recommended
 *     - Returns projects sorted by matchScore descending
 *     - The ?limit param caps the number of results
 *     - Results are always in descending score order
 *
 *   GET /api/projects/:id
 *     - Returns the correct project for a known ID
 *     - Returns 404 for an unknown ID
 *
 * WHY THIS MATTERS:
 *   The dashboard and recommendations pages depend entirely on this data.
 *   If sorting breaks, users see the wrong project at the top.
 *   If the ID lookup breaks, detail pages show a 404.
 *
 * TOOL: supertest (HTTP requests to Express without a running server)
 */

import request from 'supertest'
import { app } from '../src/app.js'
import { projects } from '../../src/data/projects.mock.js'

process.env.USE_MOCK_DATA = 'true'

// ─── GET /api/projects ───────────────────────────────────────────────────────

describe('GET /api/projects', () => {

  /**
   * Basic shape check — confirms the response structure the frontend expects.
   * The frontend destructures { ok, projects } from the response.
   */
  test('returns 200 with ok:true and a projects array', async () => {
    const res = await request(app).get('/api/projects')

    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(Array.isArray(res.body.projects)).toBe(true)
    expect(res.body.projects.length).toBeGreaterThan(0)
  })

  /**
   * Shape of each project — the frontend ProjectCard component reads these fields.
   * If any are missing the card silently renders with blanks or crashes.
   */
  test('each project has required fields', async () => {
    const res = await request(app).get('/api/projects')
    const project = res.body.projects[0]

    expect(project).toHaveProperty('id')
    expect(project).toHaveProperty('title')
    expect(project).toHaveProperty('matchScore')
    expect(project).toHaveProperty('tech')
    expect(Array.isArray(project.tech)).toBe(true)
  })

  /**
   * Category filter — ProjectsPage sends ?category=Web to filter cards.
   * Only projects matching that category should come back.
   */
  test('?category=Web returns only Web projects', async () => {
    const res = await request(app).get('/api/projects?category=Web')

    expect(res.status).toBe(200)
    res.body.projects.forEach(p => {
      expect(p.category).toBe('Web')
    })
  })

  test('?category=Data returns only Data projects', async () => {
    const res = await request(app).get('/api/projects?category=Data')

    res.body.projects.forEach(p => {
      expect(p.category).toBe('Data')
    })
  })

  /**
   * Unknown category — should return empty array, NOT crash with 500.
   * The frontend shows "No projects in this category yet" when the array is empty.
   */
  test('unknown category returns empty array not an error', async () => {
    const res = await request(app).get('/api/projects?category=UnknownXYZ')

    expect(res.status).toBe(200)
    expect(res.body.projects).toEqual([])
  })

  /**
   * No filter — omitting category should return all projects.
   */
  test('no category filter returns all projects', async () => {
    const res = await request(app).get('/api/projects')
    expect(res.body.projects.length).toBe(projects.length)
  })
})

// ─── GET /api/projects/recommended ──────────────────────────────────────────

describe('GET /api/projects/recommended', () => {

  /**
   * Default response — returns top 4 projects when no limit is specified.
   * The HomePage shows 3 and the banner shows 4, so the default must be ≥ 3.
   */
  test('returns 200 with a projects array', async () => {
    const res = await request(app).get('/api/projects/recommended')

    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(Array.isArray(res.body.projects)).toBe(true)
  })

  /**
   * Sort order — the most important requirement.
   * The highest matchScore must appear first.
   * A broken sort would mean users see less relevant projects at the top.
   */
  test('projects are sorted by matchScore descending', async () => {
    const res = await request(app).get('/api/projects/recommended?limit=10')
    const scores = res.body.projects.map(p => p.matchScore)

    for (let i = 0; i < scores.length - 1; i++) {
      expect(scores[i]).toBeGreaterThanOrEqual(scores[i + 1])
    }
  })

  /**
   * Limit param — controls how many results come back.
   * The HomePage requests 3; the full recommendations page requests all.
   */
  test('?limit=2 returns exactly 2 projects', async () => {
    const res = await request(app).get('/api/projects/recommended?limit=2')
    expect(res.body.projects.length).toBe(2)
  })

  test('?limit=1 returns exactly 1 project', async () => {
    const res = await request(app).get('/api/projects/recommended?limit=1')
    expect(res.body.projects.length).toBe(1)
  })

  /**
   * Edge case: limit larger than total projects.
   * Should return all projects, not crash.
   */
  test('limit larger than total returns all projects', async () => {
    const res = await request(app).get('/api/projects/recommended?limit=9999')
    expect(res.body.projects.length).toBeLessThanOrEqual(projects.length)
  })
})

// ─── GET /api/projects/:id ───────────────────────────────────────────────────

describe('GET /api/projects/:id', () => {

  /**
   * Happy path — the ProjectDetailPage uses this to load a project.
   * Must return the correct project object.
   */
  test('returns the correct project for a known ID', async () => {
    const knownId = projects[0].id
    const res = await request(app).get(`/api/projects/${knownId}`)

    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(res.body.project.id).toBe(knownId)
    expect(res.body.project.title).toBe(projects[0].title)
  })

  /**
   * 404 for missing project — the frontend must handle this gracefully.
   * Without this, a bad URL would crash the detail page.
   */
  test('returns 404 for an unknown project ID', async () => {
    const res = await request(app).get('/api/projects/completely-fake-id-xyz')

    expect(res.status).toBe(404)
    expect(res.body.ok).toBe(false)
  })

  /**
   * All mock projects are retrievable by ID.
   * This loop ensures none of them are accidentally unreachable.
   */
  test('all mock projects are retrievable by their ID', async () => {
    for (const project of projects) {
      const res = await request(app).get(`/api/projects/${project.id}`)
      expect(res.status).toBe(200)
      expect(res.body.project.id).toBe(project.id)
    }
  })
})
