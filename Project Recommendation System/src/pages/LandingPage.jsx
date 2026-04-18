import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FeatureSection } from '../components/landing/FeatureSection'
import { TestimonialsSection } from '../components/landing/TestimonialsSection'
import { FooterSection } from '../components/landing/FooterSection'
import './LandingPage.css'
import { applyThemeToDocument, readStoredTheme } from '../utils/theme.js'

export function LandingPage() {
  const [theme, setTheme] = useState(() => readStoredTheme())
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    applyThemeToDocument(theme)
  }, [theme])

  useEffect(() => {
    document.body.classList.toggle('pm-no-scroll', mobileNavOpen)
    return () => document.body.classList.remove('pm-no-scroll')
  }, [mobileNavOpen])

  useEffect(() => {
    if (!mobileNavOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') setMobileNavOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileNavOpen])

  const closeMobile = () => setMobileNavOpen(false)

  return (
    <div className={`pm${mobileNavOpen ? ' pm--nav-open' : ''}`}>
      <header className="pm-header">
        <div className="pm-header__inner">
          <Link to="/" className="pm-brand" onClick={closeMobile}>
            <span className="pm-brand__mark" aria-hidden="true" />
            <span className="pm-brand__name">ProjectMatch</span>
          </Link>

          <nav className="pm-nav" aria-label="Primary">
            <a className="pm-nav__link" href="#features" onClick={closeMobile}>
              Features
            </a>
            <a className="pm-nav__link" href="#about" onClick={closeMobile}>
              About
            </a>
            <a className="pm-nav__link" href="#contact" onClick={closeMobile}>
              Contact
            </a>
          </nav>

          <div className="pm-header__actions">
            <button
              type="button"
              className="pm-icon-btn"
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
            <a href="#contact" className="pm-link-btn">
              Sign In
            </a>
            <Link to="/onboarding" className="pm-btn pm-btn--solid">
              Get Started
            </Link>
          </div>

          <button
            type="button"
            className="pm-menu-btn"
            aria-expanded={mobileNavOpen}
            aria-controls="pm-drawer"
            aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileNavOpen((o) => !o)}
          >
            <span className="pm-menu-btn__bars" aria-hidden="true" />
          </button>
        </div>

        <div
          className="pm-backdrop"
          aria-hidden="true"
          onClick={closeMobile}
        />
        <div id="pm-drawer" className="pm-drawer">
          <a className="pm-drawer__link" href="#features" onClick={closeMobile}>
            Features
          </a>
          <a className="pm-drawer__link" href="#about" onClick={closeMobile}>
            About
          </a>
          <a className="pm-drawer__link" href="#contact" onClick={closeMobile}>
            Contact
          </a>
          <a href="#contact" className="pm-link-btn pm-drawer__link" onClick={closeMobile}>
            Sign In
          </a>
          <Link to="/onboarding" className="pm-btn pm-btn--solid pm-btn--block" onClick={closeMobile}>
            Get Started
          </Link>
        </div>
      </header>

      <main>
        <section className="pm-hero" aria-labelledby="pm-hero-heading">
          <div className="pm-hero__glow pm-hero__glow--tr" aria-hidden="true" />
          <div className="pm-hero__glow pm-hero__glow--bl" aria-hidden="true" />
          <div className="pm-hero__glow pm-hero__glow--br" aria-hidden="true" />

          <div className="pm-hero__inner">
            <p className="pm-badge">
              <span aria-hidden="true">✨</span> AI-Powered Project Matching
            </p>

            <h1 id="pm-hero-heading" className="pm-hero__title">
              <span className="pm-hero__title-line">Build Projects</span>
              <span className="pm-hero__title-gradient">That Match You</span>
            </h1>

            <p className="pm-hero__lead">
              Stop wasting time on projects that are too easy or too hard. Our intelligent system
              finds the <strong className="pm-hero__accent">perfect challenge</strong> for your
              skill level.
            </p>

            <div className="pm-hero__ctas">
            <Link to="/onboarding" className="pm-btn pm-btn--gradient">
                Start Your Journey <span aria-hidden="true">→</span>
              </Link>
              <Link to="/projects" className="pm-btn pm-btn--outline">
                Explore Projects
              </Link>
            </div>
          </div>

          <div className="pm-hero__showcase">
            <ul className="pm-feature-grid">
              <li className="pm-feature-card">
                <div className="pm-feature-card__icon pm-feature-card__icon--violet" aria-hidden="true">
                  <IconTarget />
                </div>
                <h3 className="pm-feature-card__title">Smart Matching</h3>
                <p className="pm-feature-card__text">
                  AI analyzes your skills to find perfect-fit projects
                </p>
              </li>
              <li className="pm-feature-card">
                <div className="pm-feature-card__icon pm-feature-card__icon--pink" aria-hidden="true">
                  <IconLightning />
                </div>
                <h3 className="pm-feature-card__title">Skill Growth</h3>
                <p className="pm-feature-card__text">
                  Track progress and level up with every project
                </p>
              </li>
              <li className="pm-feature-card">
                <div className="pm-feature-card__icon pm-feature-card__icon--cyan" aria-hidden="true">
                  <IconSparkles />
                </div>
                <h3 className="pm-feature-card__title">Curated Quality</h3>
                <p className="pm-feature-card__text">
                  Only the best projects from GitHub and beyond
                </p>
              </li>
            </ul>

            <div className="pm-social" aria-label="Community">
              <div className="pm-social__avatars" aria-hidden="true">
                <span className="pm-social__avatar pm-social__avatar--1" />
                <span className="pm-social__avatar pm-social__avatar--2" />
                <span className="pm-social__avatar pm-social__avatar--3" />
                <span className="pm-social__avatar pm-social__avatar--4" />
                <span className="pm-social__avatar pm-social__avatar--5" />
              </div>
              <p className="pm-social__title">Join 10,000+ developers</p>
              <p className="pm-social__sub">Building better projects, faster</p>
            </div>
          </div>
        </section>

        <FeatureSection />

        <TestimonialsSection />

        <section className="pm-section pm-section--muted" id="about" aria-labelledby="pm-about-heading">
          <div className="pm-section__inner">
            <h2 id="pm-about-heading" className="pm-section__title">
              About
            </h2>
            <p className="pm-section__text">
              ProjectMatch connects builders with challenges that fit their stack, timeline, and
              ambition—powered by signals you control.
            </p>
          </div>
        </section>

        <section className="pm-section" id="contact" aria-labelledby="pm-contact-heading">
          <div className="pm-section__inner">
            <h2 id="pm-contact-heading" className="pm-section__title">
              Contact
            </h2>
            <p className="pm-section__text">
              Ready to sign in or talk to us? Use <strong>Get Started</strong> for the app—team
              inquiries can reach you through your usual channels.
            </p>
            <Link to="/dashboard" className="pm-btn pm-btn--gradient pm-btn--inline">
              Open dashboard
            </Link>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  )
}

function IconTarget() {
  return (
    <svg className="pm-feature-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  )
}

function IconLightning() {
  return (
    <svg className="pm-feature-svg" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M13 2L3 14h8l-1 8L22 10h-8l1-8z" />
    </svg>
  )
}

function IconSparkles() {
  return (
    <svg className="pm-feature-svg" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M9.5 4.5l.8 2.8 2.8.8-2.8.8-.8 2.8-.8-2.8-2.8-.8 2.8-.8.8-2.8zm8 3l.5 1.7 1.7.5-1.7.5-.5 1.7-.5-1.7-1.7-.5 1.7-.5.5-1.7zM4 14l.6 2.1 2.1.6-2.1.6-.6 2.1-.6-2.1-2.1-.6 2.1-.6.6-2.1zm12 2l.7 2.4 2.4.7-2.4.7-.7 2.4-.7-2.4-2.4-.7 2.4-.7.7-2.4z"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg className="pm-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg className="pm-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}
