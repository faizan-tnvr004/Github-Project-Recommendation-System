/**
 * savedProjects.test.js — Utility function unit tests
 *
 * PURPOSE:
 *   These are pure unit tests — they test individual utility functions
 *   in isolation, with no React, no server, and no network.
 *   They run the fastest of all tests.
 *
 * WHAT IS TESTED:
 *   readSavedProjectIds()
 *     - Returns an empty array when localStorage is empty
 *     - Returns previously stored IDs
 *     - Handles corrupted localStorage data gracefully (no crash)
 *
 *   toggleSavedProject()
 *     - Adds an ID when it's not already saved
 *     - Removes an ID when it IS already saved (toggle behaviour)
 *     - Works with a plain string ID (for local mock projects)
 *     - Works with a GitHub repo object (stores the full repo data)
 *
 *   readSavedGithubRepos()
 *     - Returns saved GitHub repo objects (not just IDs)
 *     - Returns empty array when nothing is saved
 *
 * WHY UNIT TEST UTILITIES:
 *   These functions are used by SavedProjectsPage, RecommendationsPage,
 *   ProjectsPage, and HomePage. A bug here silently breaks save/unsave
 *   across the entire app. Testing them independently pins down exactly
 *   where a failure is if something breaks.
 *
 * HOW LOCALSTORAGE IS HANDLED:
 *   jsdom (the fake browser environment) provides localStorage.
 *   We clear it before each test so state doesn't bleed between tests.
 */

import { describe, test, expect, beforeEach } from 'vitest'
import {
  readSavedProjectIds,
  readSavedGithubRepos,
  toggleSavedProject,
  toggleSavedProjectId,
} from '../utils/savedProjects'

// Wipe localStorage before every test — ensures a clean slate
beforeEach(() => {
  localStorage.clear()
})

// ─── readSavedProjectIds ─────────────────────────────────────────────────────

describe('readSavedProjectIds()', () => {

  /**
   * Default state — brand-new user has nothing saved.
   */
  test('returns empty array when localStorage is empty', () => {
    const ids = readSavedProjectIds()
    expect(ids).toEqual([])
  })

  /**
   * After saving — IDs written to localStorage are read back correctly.
   */
  test('returns IDs that were previously saved', () => {
    localStorage.setItem('prs-saved-project-ids', JSON.stringify(['id-1', 'id-2']))
    const ids = readSavedProjectIds()
    expect(ids).toEqual(['id-1', 'id-2'])
  })

  /**
   * Resilience — corrupted data must not crash the app.
   * If localStorage holds garbage, return [] silently.
   */
  test('returns empty array for corrupted localStorage data', () => {
    localStorage.setItem('prs-saved-project-ids', '{ this is not valid JSON !!!')
    const ids = readSavedProjectIds()
    expect(ids).toEqual([])
  })

  /**
   * Type safety — only strings should be returned, not numbers or null.
   */
  test('filters out non-string entries', () => {
    localStorage.setItem('prs-saved-project-ids', JSON.stringify(['valid-id', 123, null, 'another']))
    const ids = readSavedProjectIds()
    expect(ids).toEqual(['valid-id', 'another'])
  })
})

// ─── toggleSavedProject ──────────────────────────────────────────────────────

describe('toggleSavedProject()', () => {

  /**
   * Add behaviour — passing a new ID adds it to the saved list.
   */
  test('adds an ID when it is not already saved', () => {
    const result = toggleSavedProject('project-abc')
    expect(result).toContain('project-abc')
  })

  /**
   * Remove behaviour — passing an ID that IS saved removes it.
   * This is the toggle: clicking the bookmark on a saved project unsaves it.
   */
  test('removes an ID when it is already saved', () => {
    toggleSavedProject('project-abc')       // add it
    const result = toggleSavedProject('project-abc')  // remove it

    expect(result).not.toContain('project-abc')
  })

  /**
   * Multiple saves — saving several items, all should persist.
   */
  test('accumulates multiple saved IDs correctly', () => {
    toggleSavedProject('proj-1')
    toggleSavedProject('proj-2')
    const result = toggleSavedProject('proj-3')

    expect(result).toContain('proj-1')
    expect(result).toContain('proj-2')
    expect(result).toContain('proj-3')
  })

  /**
   * Selective remove — removing one ID leaves the others intact.
   */
  test('only removes the specified ID, leaving others', () => {
    toggleSavedProject('proj-1')
    toggleSavedProject('proj-2')
    toggleSavedProject('proj-3')

    const result = toggleSavedProject('proj-2') // remove just this one

    expect(result).toContain('proj-1')
    expect(result).not.toContain('proj-2')
    expect(result).toContain('proj-3')
  })

  /**
   * GitHub repo object — passing a full repo object stores the data
   * AND adds the ID, so the saved projects page can render the card.
   */
  test('persists GitHub repo data when passed an object with isGithub:true', () => {
    const fakeRepo = {
      id: 'gh-12345',
      title: 'org/repo',
      tagline: 'A test repo',
      score: 78,
      isGithub: true,
      githubUrl: 'https://github.com/org/repo',
      stars: 1200,
      forks: 300,
      language: 'TypeScript',
      lastPushed: new Date().toISOString(),
      tech: ['typescript', 'node'],
      openIssues: 10,
      license: 'MIT',
    }

    toggleSavedProject(fakeRepo)

    // The ID should be in the IDs list
    const ids = readSavedProjectIds()
    expect(ids).toContain('gh-12345')

    // The full repo should be in the GitHub repos store
    const repos = readSavedGithubRepos()
    expect(repos.length).toBe(1)
    expect(repos[0].id).toBe('gh-12345')
    expect(repos[0].title).toBe('org/repo')
    expect(repos[0].score).toBe(78)
  })

  /**
   * GitHub repo unsave — removing a GitHub repo clears its data too.
   */
  test('removes GitHub repo data when toggled off', () => {
    const fakeRepo = { id: 'gh-99', title: 'x/y', isGithub: true, score: 50,
      githubUrl: '#', stars: 0, forks: 0, language: null, lastPushed: new Date().toISOString(),
      tech: [], openIssues: 0, license: null, tagline: '' }

    toggleSavedProject(fakeRepo)     // save
    toggleSavedProject(fakeRepo)     // unsave

    expect(readSavedProjectIds()).not.toContain('gh-99')
    expect(readSavedGithubRepos()).toEqual([])
  })
})

// ─── toggleSavedProjectId (legacy alias) ────────────────────────────────────

describe('toggleSavedProjectId() legacy alias', () => {
  test('behaves the same as toggleSavedProject with a string', () => {
    const result = toggleSavedProjectId('legacy-id')
    expect(result).toContain('legacy-id')
  })
})

// ─── readSavedGithubRepos ────────────────────────────────────────────────────

describe('readSavedGithubRepos()', () => {

  test('returns empty array when nothing is saved', () => {
    expect(readSavedGithubRepos()).toEqual([])
  })

  test('returns all saved GitHub repo objects', () => {
    const repo1 = { id: 'gh-1', title: 'a/b', isGithub: true, score: 60,
      githubUrl: '#', stars: 0, forks: 0, language: null,
      lastPushed: new Date().toISOString(), tech: [], openIssues: 0, license: null, tagline: '' }
    const repo2 = { ...repo1, id: 'gh-2', title: 'c/d' }

    toggleSavedProject(repo1)
    toggleSavedProject(repo2)

    const saved = readSavedGithubRepos()
    expect(saved.length).toBe(2)
    const ids = saved.map(r => r.id)
    expect(ids).toContain('gh-1')
    expect(ids).toContain('gh-2')
  })
})
