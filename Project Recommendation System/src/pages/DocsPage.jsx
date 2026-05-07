import { Link } from 'react-router-dom'
import { applyThemeToDocument, readStoredTheme } from '../utils/theme'
import { useEffect, useState } from 'react'

const SECTIONS = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    steps: [
      {
        heading: '1. Create an account',
        body: 'Click Sign Up on the landing page. Enter your name, email, and a password (min 6 characters). You\'ll be taken straight to the dashboard.',
      },
      {
        heading: '2. Run through Onboarding',
        body: 'Click Get Started on the landing page to complete the 4-step setup wizard. You\'ll pick your skill level, preferred technologies, goals, and available time. This shapes your recommendations.',
      },
      {
        heading: '3. Explore your dashboard',
        body: 'The dashboard shows your top 3 project matches, quick stats, and a recommendations banner. Bookmark any project with the ☆ icon — it saves instantly.',
      },
    ],
  },
  {
    id: 'recommendations',
    title: 'Recommended Projects',
    steps: [
      {
        heading: 'How the health score works',
        body: 'Every project pulled from GitHub is scored 0–100 using 7 signals: popularity (stars/forks/watchers), documentation quality (description, wiki, topics), maintenance activity (days since last push), community size (open issues), contributor-friendliness (good-first-issue tags), trustworthiness (license, repo age), and code health (codebase size).',
      },
      {
        heading: 'Score tiers',
        body: 'Green (70+) = actively maintained, well-documented. Amber (45–69) = decent quality, moderate activity. Grey (<45) = rising projects that may be newer or niche.',
      },
      {
        heading: 'Filter by language',
        body: 'Use the language dropdown to narrow results to a specific tech stack (JavaScript, Python, Go, Rust, etc.).',
      },
      {
        heading: 'Save a project',
        body: 'Click the bookmark icon on any card. The project is saved to your device and appears in the Saved Projects tab immediately.',
      },
    ],
  },
  {
    id: 'search',
    title: 'Searching Projects',
    steps: [
      {
        heading: 'Header search bar',
        body: 'Type anything in the top search bar and press Enter. You\'ll be taken to the Explore page with your query pre-filled and results loaded automatically.',
      },
      {
        heading: 'Explore page search',
        body: 'Go to Explore Projects in the sidebar. Type a keyword (e.g. "react hooks", "machine learning", "rust cli") and results appear after a short debounce. Add a language filter for more precise results.',
      },
      {
        heading: 'Quick-start chips',
        body: 'When the search box is empty, suggestion chips appear (e.g. "devops tools", "open source beginner"). Click one to run that search instantly.',
      },
    ],
  },
  {
    id: 'saved',
    title: 'Saved Projects',
    steps: [
      {
        heading: 'Viewing saved projects',
        body: 'Open Saved Projects from the sidebar. GitHub projects and local projects are shown in separate sections. Each card includes the health score bar and a direct link to GitHub.',
      },
      {
        heading: 'Removing a saved project',
        body: 'Click the filled bookmark icon on any saved card to remove it. The change is instant.',
      },
      {
        heading: 'Persistence',
        body: 'Saved projects are stored in your browser\'s localStorage. They persist across sessions on the same device/browser. If you clear browser data, saved projects will be lost.',
      },
    ],
  },
  {
    id: 'settings',
    title: 'Settings & Profile',
    steps: [
      {
        heading: 'Dark / Light mode',
        body: 'Toggle via the moon/sun button in the sidebar (just below the nav links) or in Settings → Appearance. Your preference is remembered across sessions.',
      },
      {
        heading: 'Profile page',
        body: 'Shows your name, email, saved project count, and account ID. Use the Sign Out button here to log out.',
      },
      {
        heading: 'Settings page',
        body: 'Control dark mode, compact view, and notification preferences. The "GitHub API" status indicator shows whether live data is active.',
      },
    ],
  },
]

function Section({ section }) {
  return (
    <section id={section.id} style={{ marginBottom: '2.5rem' }}>
      <h2 style={{
        margin: '0 0 1rem', fontSize: '1.15rem', fontWeight: 700,
        color: 'var(--prs-text)', paddingBottom: '0.6rem',
        borderBottom: '2px solid var(--prs-primary-faint)',
      }}>
        {section.title}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {section.steps.map((s) => (
          <div key={s.heading} style={{
            padding: '1rem',
            borderRadius: 'var(--prs-radius)',
            background: 'var(--prs-surface)',
            border: '1px solid var(--prs-border)',
            boxShadow: 'var(--prs-shadow-sm)',
          }}>
            <h3 style={{ margin: '0 0 0.35rem', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--prs-text)' }}>
              {s.heading}
            </h3>
            <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.65 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function DocsPage() {
  const [theme, setTheme] = useState(() => readStoredTheme())

  useEffect(() => { applyThemeToDocument(theme) }, [theme])

  return (
    <div style={{
      minHeight: '100svh',
      background: 'var(--prs-bg-subtle)',
      fontFamily: 'var(--prs-font)',
      color: 'var(--prs-muted)',
    }}>
      {/* Top bar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'color-mix(in srgb, var(--prs-surface) 90%, transparent)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--prs-border)',
        padding: '0.65rem clamp(1rem,4vw,2.5rem)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <span style={{ width: 26, height: 26, borderRadius: 7, background: '#7c3aed', display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--prs-text)' }}>ProjectMatch</span>
        </Link>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setTheme(t => { const n = t === 'dark' ? 'light' : 'dark'; applyThemeToDocument(n); return n })}
            aria-label="Toggle theme"
            style={{ background: 'none', border: '1px solid var(--prs-border)', borderRadius: '0.5rem', padding: '0.35rem 0.6rem', cursor: 'pointer', color: 'var(--prs-muted)' }}
          >
            {theme === 'dark' ? '☀︎' : '☽'}
          </button>
          <Link to="/dashboard" className="prs-button prs-button--primary" style={{ fontSize: '0.875rem', padding: '0.45rem 0.9rem' }}>
            Open app
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(1.5rem,4vw,3rem) clamp(1rem,4vw,2.5rem)' }}>
        {/* Page header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{ margin: '0 0 0.35rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--prs-primary)' }}>
            Documentation
          </p>
          <h1 style={{ margin: '0 0 0.5rem', fontSize: 'clamp(1.75rem,4vw,2.25rem)', fontWeight: 700, color: 'var(--prs-text)', letterSpacing: '-0.02em' }}>
            How to use ProjectMatch
          </h1>
          <p style={{ margin: 0, maxWidth: '36rem', fontSize: '1rem', lineHeight: 1.65 }}>
            Find, evaluate, and save open-source projects tailored to your skill level — powered by live GitHub data and a multi-signal health score.
          </p>
        </div>

        {/* Quick-nav */}
        <nav aria-label="Page sections" style={{
          display: 'flex', flexWrap: 'wrap', gap: '0.5rem',
          marginBottom: '2.5rem', padding: '1rem',
          background: 'var(--prs-surface)', borderRadius: 'var(--prs-radius)',
          border: '1px solid var(--prs-border)',
        }}>
          {SECTIONS.map(s => (
            <a key={s.id} href={`#${s.id}`} style={{
              fontSize: '0.8125rem', fontWeight: 500,
              color: 'var(--prs-primary)', textDecoration: 'none',
              padding: '0.3rem 0.65rem', borderRadius: '999px',
              background: 'var(--prs-primary-faint)',
            }}>
              {s.title}
            </a>
          ))}
        </nav>

        {/* Sections */}
        {SECTIONS.map(s => <Section key={s.id} section={s} />)}

        {/* Footer CTA */}
        <div style={{
          marginTop: '3rem', padding: '1.5rem',
          background: 'var(--prs-surface)', borderRadius: 'var(--prs-radius)',
          border: '1px solid var(--prs-border)',
          textAlign: 'center',
        }}>
          <p style={{ margin: '0 0 1rem', fontWeight: 600, color: 'var(--prs-text)' }}>Ready to start?</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" className="prs-button prs-button--primary">Create account</Link>
            <Link to="/dashboard" className="prs-button prs-button--ghost">Open dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
