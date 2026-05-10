/**
 * projects.data.test.js — Mock data utility function tests
 *
 * PURPOSE:
 *   Tests the helper functions exported from src/data/projects.js.
 *   These functions power the HomePage (top matches), ProjectDetailPage,
 *   and are used as fallback data across the app.
 *
 * WHAT IS TESTED:
 *   getProjectById(id)
 *     - Returns the correct project for a known ID
 *     - Returns undefined for an unknown ID (not crash)
 *
 *   getRecommended(limit)
 *     - Returns projects sorted by matchScore descending
 *     - Respects the limit argument
 *     - Default limit returns at most 4 projects
 *
 *   getByLevel(level)
 *     - Returns only projects matching the given level
 *     - Returns empty array for an unknown level
 *
 *   projects array
 *     - Every project has required fields (id, title, tech, matchScore)
 *     - No two projects have the same ID (no duplicates)
 *     - All tech fields are non-empty arrays
 *
 * WHY TEST MOCK DATA:
 *   The mock data is what the app falls back to when the backend is
 *   unreachable. If a project has a missing `tech` array, ProjectCard
 *   will crash when it tries to call .slice() on undefined.
 *   These tests act as a schema validation for the data.
 */

import { describe, test, expect } from 'vitest'
import { projects, getProjectById, getRecommended, getByLevel } from '../data/projects'

// ─── Data integrity ──────────────────────────────────────────────────────────

describe('projects array (data integrity)', () => {

  /**
   * Every project must have the fields the UI components read.
   * A missing field silently renders blank or crashes.
   */
  test('every project has required fields', () => {
    const requiredFields = ['id', 'title', 'tagline', 'category', 'level', 'matchScore', 'tech', 'duration', 'teamSize']

    projects.forEach(project => {
      requiredFields.forEach(field => {
        expect(project, `Project "${project.id}" is missing field: ${field}`)
          .toHaveProperty(field)
      })
    })
  })

  /**
   * tech must be a non-empty array — ProjectCard calls tech.slice(0,3).
   * An empty or non-array tech would either show nothing or crash.
   */
  test('every project has a non-empty tech array', () => {
    projects.forEach(project => {
      expect(Array.isArray(project.tech), `${project.id} tech is not an array`).toBe(true)
      expect(project.tech.length, `${project.id} has empty tech array`).toBeGreaterThan(0)
    })
  })

  /**
   * matchScore must be a number between 0 and 100.
   * The scoring display and sorting depend on this.
   */
  test('every project matchScore is a number 0–100', () => {
    projects.forEach(project => {
      expect(typeof project.matchScore).toBe('number')
      expect(project.matchScore).toBeGreaterThanOrEqual(0)
      expect(project.matchScore).toBeLessThanOrEqual(100)
    })
  })

  /**
   * IDs must be unique — duplicate IDs would cause React key warnings
   * and incorrect data being shown on detail pages.
   */
  test('all project IDs are unique', () => {
    const ids = projects.map(p => p.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })

  /**
   * Level must be one of the expected values.
   * The difficulty badge and filters depend on this.
   */
  test('all project levels are valid', () => {
    const validLevels = ['Beginner', 'Intermediate', 'Advanced']
    projects.forEach(project => {
      expect(validLevels).toContain(project.level)
    })
  })

  /**
   * Category must match one of the filter options in ProjectsPage.
   */
  test('all project categories are valid', () => {
    const validCategories = ['Web', 'Data']
    projects.forEach(project => {
      expect(validCategories).toContain(project.category)
    })
  })
})

// ─── getProjectById ──────────────────────────────────────────────────────────

describe('getProjectById()', () => {

  test('returns the correct project for a known ID', () => {
    const first = projects[0]
    const result = getProjectById(first.id)

    expect(result).toBeDefined()
    expect(result.id).toBe(first.id)
    expect(result.title).toBe(first.title)
  })

  /**
   * All project IDs are findable — ensures none are accidentally broken.
   */
  test('finds every project by its own ID', () => {
    projects.forEach(project => {
      const found = getProjectById(project.id)
      expect(found).toBeDefined()
      expect(found.id).toBe(project.id)
    })
  })

  /**
   * Unknown ID — must return undefined, not throw.
   * ProjectDetailPage checks for undefined before rendering.
   */
  test('returns undefined for an unknown ID', () => {
    const result = getProjectById('this-id-does-not-exist')
    expect(result).toBeUndefined()
  })

  test('returns undefined for empty string', () => {
    expect(getProjectById('')).toBeUndefined()
  })
})

// ─── getRecommended ──────────────────────────────────────────────────────────

describe('getRecommended()', () => {

  /**
   * Sort order — this is the core requirement.
   * The first item must always have the highest matchScore.
   */
  test('returns projects sorted by matchScore descending', () => {
    const result = getRecommended(projects.length)
    const scores = result.map(p => p.matchScore)

    for (let i = 0; i < scores.length - 1; i++) {
      expect(scores[i]).toBeGreaterThanOrEqual(scores[i + 1])
    }
  })

  /**
   * Limit — the HomePage requests 3, the banner requests 4.
   */
  test('respects the limit argument', () => {
    expect(getRecommended(1).length).toBe(1)
    expect(getRecommended(2).length).toBe(2)
    expect(getRecommended(3).length).toBe(3)
  })

  /**
   * Default limit — calling without an argument returns at most 4.
   */
  test('default limit returns at most 4 projects', () => {
    expect(getRecommended().length).toBeLessThanOrEqual(4)
  })

  /**
   * Does not mutate original — getRecommended sorts a copy.
   * Mutating the original array would cause unpredictable ordering
   * in other parts of the app that rely on insertion order.
   */
  test('does not mutate the original projects array', () => {
    const originalFirst = projects[0].id
    getRecommended(projects.length)
    expect(projects[0].id).toBe(originalFirst)
  })

  /**
   * Limit larger than total — should return all projects, not crash.
   */
  test('limit larger than total returns all projects', () => {
    const result = getRecommended(9999)
    expect(result.length).toBe(projects.length)
  })
})

// ─── getByLevel ──────────────────────────────────────────────────────────────

describe('getByLevel()', () => {

  test('returns only Beginner projects', () => {
    const result = getByLevel('Beginner')
    expect(result.length).toBeGreaterThan(0)
    result.forEach(p => expect(p.level).toBe('Beginner'))
  })

  test('returns only Intermediate projects', () => {
    const result = getByLevel('Intermediate')
    expect(result.length).toBeGreaterThan(0)
    result.forEach(p => expect(p.level).toBe('Intermediate'))
  })

  test('returns only Advanced projects', () => {
    const result = getByLevel('Advanced')
    expect(result.length).toBeGreaterThan(0)
    result.forEach(p => expect(p.level).toBe('Advanced'))
  })

  /**
   * Beginner + Intermediate + Advanced should cover ALL projects.
   * If any are missing a level, the total won't add up.
   */
  test('all levels combined cover all projects', () => {
    const beginners     = getByLevel('Beginner').length
    const intermediates = getByLevel('Intermediate').length
    const advanced      = getByLevel('Advanced').length
    expect(beginners + intermediates + advanced).toBe(projects.length)
  })

  test('unknown level returns empty array', () => {
    expect(getByLevel('Expert')).toEqual([])
    expect(getByLevel('')).toEqual([])
  })
})
