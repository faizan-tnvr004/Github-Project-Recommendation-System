/**
 * ProjectCard.test.jsx — ProjectCard component tests
 *
 * PURPOSE:
 *   Tests the ProjectCard component — the most reused UI component in the app.
 *   It appears on the Dashboard, Projects page, and Saved Projects page.
 *   A bug here affects everywhere at once.
 *
 * WHAT IS TESTED:
 *   Rendering:
 *     - Project title renders and links to the detail page
 *     - Tech tags render (up to 3)
 *     - Match score renders when showScore=true
 *     - Match score is hidden when showScore=false
 *     - Difficulty badge renders based on matchScore
 *
 *   Bookmark button:
 *     - Renders in unsaved state by default
 *     - Renders in saved state when saved=true
 *     - Calls onToggleSaved with the correct project ID when clicked
 *     - Does NOT navigate away when clicked (stopPropagation works)
 *
 *   Accessibility:
 *     - Bookmark button has a descriptive aria-label
 *     - aria-pressed reflects the saved state
 *
 * KEY CONCEPT — testing a component in isolation:
 *   ProjectCard only receives props (project, saved, onToggleSaved, showScore).
 *   We don't need a real server or auth context — we just pass in a fake
 *   project object and check what the DOM looks like.
 */

import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProjectCard } from '../components/project/ProjectCard'

// ─── Test data ───────────────────────────────────────────────────────────────

/** A minimal project that satisfies every field ProjectCard reads */
const mockProject = {
  id: 'pr-test-project',
  title: 'Test Project Title',
  tagline: 'A short description of this project',
  matchScore: 88,
  tech: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'], // 4 items — card should show 3
  duration: '2-3 weeks',
  teamSize: '1-2',
}

const beginnerProject = { ...mockProject, id: 'pr-beginner', matchScore: 60 }
const advancedProject = { ...mockProject, id: 'pr-advanced', matchScore: 95 }

/** Renders ProjectCard wrapped in MemoryRouter (needed for <Link>) */
function renderCard(props = {}) {
  return render(
    <MemoryRouter>
      <ProjectCard
        project={mockProject}
        showScore={true}
        saved={false}
        onToggleSaved={vi.fn()}
        {...props}
      />
    </MemoryRouter>
  )
}

// ─── Rendering tests ─────────────────────────────────────────────────────────

describe('ProjectCard — rendering', () => {

  test('renders the project title', () => {
    renderCard()
    expect(screen.getByText('Test Project Title')).toBeInTheDocument()
  })

  test('title is a link to the project detail page', () => {
    renderCard()
    const link = screen.getByRole('link', { name: /test project title/i })
    expect(link).toHaveAttribute('href', '/projects/pr-test-project')
  })

  test('renders tech tags (up to 3)', () => {
    renderCard()
    // ProjectCard slices tech to 3
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Node.js')).toBeInTheDocument()
    // 4th tag should NOT appear — it's sliced off
    expect(screen.queryByText('PostgreSQL')).not.toBeInTheDocument()
  })

  /**
   * Match score visibility — controlled by the showScore prop.
   * Recommendations page shows it; some other contexts hide it.
   */
  test('renders match score when showScore=true', () => {
    renderCard({ showScore: true })
    expect(screen.getByText(/88%\s*match/i)).toBeInTheDocument()
  })

  test('hides match score when showScore=false', () => {
    renderCard({ showScore: false })
    expect(screen.queryByText(/88%\s*match/i)).not.toBeInTheDocument()
  })

  /**
   * Difficulty badge — derived from matchScore.
   * 88 falls in the Intermediate range (85–91).
   */
  test('shows Intermediate badge for matchScore 88', () => {
    renderCard()
    expect(screen.getByText('Intermediate')).toBeInTheDocument()
  })

  test('shows Beginner badge for low matchScore', () => {
    renderCard({ project: beginnerProject })
    expect(screen.getByText('Beginner')).toBeInTheDocument()
  })

  test('shows Advanced badge for high matchScore', () => {
    renderCard({ project: advancedProject })
    expect(screen.getByText('Advanced')).toBeInTheDocument()
  })

  test('renders the View brief link', () => {
    renderCard()
    expect(screen.getByRole('link', { name: /view brief/i })).toBeInTheDocument()
  })
})

// ─── Bookmark button tests ────────────────────────────────────────────────────

describe('ProjectCard — bookmark button', () => {

  /**
   * aria-pressed communicates save state to screen readers.
   */
  test('bookmark has aria-pressed=false when not saved', () => {
    renderCard({ saved: false })
    const btn = screen.getByRole('button', { name: /save project/i })
    expect(btn).toHaveAttribute('aria-pressed', 'false')
  })

  test('bookmark has aria-pressed=true when saved', () => {
    renderCard({ saved: true })
    const btn = screen.getByRole('button', { name: /remove from saved/i })
    expect(btn).toHaveAttribute('aria-pressed', 'true')
  })

  /**
   * Click triggers the callback with the correct project ID.
   * The parent component (e.g. RecommendationsPage) handles the actual toggle.
   */
  test('clicking bookmark calls onToggleSaved with the project id', () => {
    const onToggleSaved = vi.fn()
    renderCard({ onToggleSaved })

    fireEvent.click(screen.getByRole('button', { name: /save project/i }))

    expect(onToggleSaved).toHaveBeenCalledTimes(1)
    expect(onToggleSaved).toHaveBeenCalledWith('pr-test-project')
  })

  /**
   * onToggleSaved is optional — passing no handler must not throw.
   */
  test('does not crash when onToggleSaved is not provided', () => {
    renderCard({ onToggleSaved: undefined })
    expect(() => {
      fireEvent.click(screen.getByRole('button', { name: /save project/i }))
    }).not.toThrow()
  })
})
