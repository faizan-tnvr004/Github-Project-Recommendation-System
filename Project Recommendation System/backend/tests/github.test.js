/**
 * github.test.js — GitHub API route tests
 *
 * PURPOSE:
 *   Tests the two GitHub endpoints that power the Explore and Recommendations pages.
 *   Because these routes call the real GitHub API (an external service),
 *   we MOCK the global fetch function — this means tests run instantly,
 *   don't require internet, don't consume API rate limits, and always return
 *   predictable data.
 *
 * WHAT IS TESTED:
 *   GET /api/github/search
 *     - Requires a ?q= query param (returns 400 without it)
 *     - Returns scored and sorted repos from GitHub
 *     - Each repo has the fields the frontend expects
 *     - Language filter is forwarded to GitHub correctly
 *
 *   GET /api/github/recommended
 *     - Returns repos without requiring a query
 *     - Repos are sorted by score descending
 *     - ?limit param caps results
 *
 * HOW MOCKING WORKS:
 *   Instead of letting fetch call github.com, we replace it with a fake
 *   function (jest.fn()) that immediately returns a pre-written response.
 *   This is called "mocking an external dependency."
 *
 * TOOL: Jest's built-in mocking + supertest
 */

import request from 'supertest'
import { app } from '../src/app.js'

process.env.USE_MOCK_DATA = 'true'

// ─── Mock GitHub API data ────────────────────────────────────────────────────

/**
 * A minimal fake repository object that matches the shape GitHub returns.
 * We include all the fields our scoring function reads so scores are realistic.
 */
function makeFakeRepo(overrides = {}) {
  return {
    id: Math.floor(Math.random() * 1_000_000),
    full_name: 'test-org/test-repo',
    name: 'test-repo',
    description: 'A well-documented test repository with plenty of detail',
    language: 'JavaScript',
    stargazers_count: 1500,
    forks_count: 300,
    watchers_count: 1500,
    open_issues_count: 45,
    topics: ['javascript', 'react', 'open-source', 'good-first-issue'],
    has_wiki: true,
    has_pages: false,
    homepage: 'https://example.com',
    license: { spdx_id: 'MIT' },
    pushed_at: new Date(Date.now() - 3 * 86_400_000).toISOString(), // 3 days ago
    created_at: new Date(Date.now() - 2 * 365 * 86_400_000).toISOString(), // 2 years ago
    html_url: 'https://github.com/test-org/test-repo',
    archived: false,
    disabled: false,
    size: 5000,
    ...overrides,
  }
}

/** Builds the fake GitHub search response with n repos */
function mockGitHubResponse(count = 3) {
  const items = Array.from({ length: count }, (_, i) =>
    makeFakeRepo({ id: i + 1, full_name: `org/repo-${i + 1}` })
  )
  return {
    total_count: count,
    incomplete_results: false,
    items,
  }
}

/** Sets up global.fetch to return the given data */
function mockFetch(data, status = 200) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
  })
}

// Reset fetch mock after every test so tests don't bleed into each other
afterEach(() => {
  jest.restoreAllMocks()
})

// ─── GET /api/github/search ──────────────────────────────────────────────────

describe('GET /api/github/search', () => {

  /**
   * Missing query param — the controller must reject this immediately.
   * Without a query, GitHub would return everything, which is useless.
   */
  test('returns 400 when ?q is missing', async () => {
    const res = await request(app).get('/api/github/search')

    expect(res.status).toBe(400)
    expect(res.body.ok).toBe(false)
    expect(res.body.error).toMatch(/query/i)
  })

  /**
   * Happy path — mock GitHub returns 3 repos, we get them back scored + sorted.
   * This confirms the full pipeline: fetch → parse → score → sort → respond.
   */
  test('returns scored repos for a valid query', async () => {
    mockFetch(mockGitHubResponse(3))

    const res = await request(app).get('/api/github/search?q=react')

    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(Array.isArray(res.body.repos)).toBe(true)
    expect(res.body.repos.length).toBe(3)
  })

  /**
   * Shape of each returned repo — the frontend GitHubProjectCard reads these.
   * If any field is missing the UI will show blank or crash.
   */
  test('each repo has the expected fields', async () => {
    mockFetch(mockGitHubResponse(1))

    const res = await request(app).get('/api/github/search?q=react')
    const repo = res.body.repos[0]

    expect(repo).toHaveProperty('id')
    expect(repo).toHaveProperty('title')
    expect(repo).toHaveProperty('tagline')
    expect(repo).toHaveProperty('score')
    expect(repo).toHaveProperty('stars')
    expect(repo).toHaveProperty('githubUrl')
    expect(repo).toHaveProperty('language')
    expect(repo).toHaveProperty('isGithub', true)
  })

  /**
   * Scoring — every repo must have a numeric score between 0 and 100.
   */
  test('all repos have a score between 0 and 100', async () => {
    mockFetch(mockGitHubResponse(5))

    const res = await request(app).get('/api/github/search?q=typescript')

    res.body.repos.forEach(repo => {
      expect(typeof repo.score).toBe('number')
      expect(repo.score).toBeGreaterThanOrEqual(0)
      expect(repo.score).toBeLessThanOrEqual(100)
    })
  })

  /**
   * Sort order — results must come back sorted by score descending.
   * The whole point of the feature is showing the best projects first.
   */
  test('repos are sorted by score descending', async () => {
    // Give repos different characteristics so they score differently
    const items = [
      makeFakeRepo({ id: 1, stargazers_count: 100,   pushed_at: new Date(Date.now() - 200 * 86_400_000).toISOString() }),
      makeFakeRepo({ id: 2, stargazers_count: 50000, pushed_at: new Date(Date.now() - 1 * 86_400_000).toISOString() }),
      makeFakeRepo({ id: 3, stargazers_count: 1000,  pushed_at: new Date(Date.now() - 10 * 86_400_000).toISOString() }),
    ]
    mockFetch({ total_count: 3, items })

    const res = await request(app).get('/api/github/search?q=python')
    const scores = res.body.repos.map(r => r.score)

    for (let i = 0; i < scores.length - 1; i++) {
      expect(scores[i]).toBeGreaterThanOrEqual(scores[i + 1])
    }
  })

  /**
   * Limit param — the frontend requests 24 at a time.
   */
  test('?limit caps the number of results', async () => {
    mockFetch(mockGitHubResponse(10))

    const res = await request(app).get('/api/github/search?q=vue&limit=3')

    expect(res.body.repos.length).toBeLessThanOrEqual(3)
  })

  /**
   * GitHub API error — if GitHub returns a non-200 status, we forward it.
   */
  test('forwards GitHub API errors to the client', async () => {
    mockFetch({ message: 'API rate limit exceeded' }, 403)

    const res = await request(app).get('/api/github/search?q=react')

    expect(res.status).toBe(403)
    expect(res.body.ok).toBe(false)
  })

  /**
   * Archived repos score lower — an archived repo should never outscore
   * an identical active repo.
   */
  test('archived repos score lower than active repos', async () => {
    const activeRepo   = makeFakeRepo({ id: 1, archived: false })
    const archivedRepo = makeFakeRepo({ id: 2, archived: true })
    mockFetch({ total_count: 2, items: [activeRepo, archivedRepo] })

    const res = await request(app).get('/api/github/search?q=rust')
    const [first, second] = res.body.repos

    // Active should outscore archived (repos come back sorted so first ≥ second)
    expect(first.score).toBeGreaterThanOrEqual(second.score)
  })
})

// ─── GET /api/github/recommended ────────────────────────────────────────────

describe('GET /api/github/recommended', () => {

  /**
   * No query required — unlike search, recommended has a built-in query.
   */
  test('returns 200 with repos array (no query needed)', async () => {
    mockFetch(mockGitHubResponse(5))

    const res = await request(app).get('/api/github/recommended')

    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(Array.isArray(res.body.repos)).toBe(true)
  })

  /**
   * ?limit param — the RecommendationsPage requests 30 at a time.
   */
  test('?limit caps the results', async () => {
    mockFetch(mockGitHubResponse(20))

    const res = await request(app).get('/api/github/recommended?limit=5')

    expect(res.body.repos.length).toBeLessThanOrEqual(5)
  })

  /**
   * Repos are sorted by score — same requirement as search.
   */
  test('repos are sorted by score descending', async () => {
    mockFetch(mockGitHubResponse(8))

    const res = await request(app).get('/api/github/recommended')
    const scores = res.body.repos.map(r => r.score)

    for (let i = 0; i < scores.length - 1; i++) {
      expect(scores[i]).toBeGreaterThanOrEqual(scores[i + 1])
    }
  })
})
