import './FooterSection.css'

const COLUMNS = [
  {
    title: 'Product',
    links: ['Features', 'Pricing', 'Security', 'Roadmap'],
  },
  {
    title: 'Company',
    links: ['About', 'Blog', 'Careers', 'Press'],
  },
  {
    title: 'Resources',
    links: ['Documentation', 'Help Center', 'API Reference', 'Community'],
  },
  {
    title: 'Legal',
    links: ['Privacy', 'Terms', 'Cookie Policy', 'Licenses'],
  },
]

export function FooterSection() {
  return (
    <footer className="pm-final-footer" aria-label="Footer">
      <div className="pm-final-footer__inner">
        <div className="pm-final-footer__top">
          <div className="pm-final-footer__brand">
            <div className="pm-final-footer__brand-row">
              <span className="pm-final-footer__brand-mark" aria-hidden="true" />
              <span className="pm-final-footer__brand-name">ProjectMatch</span>
            </div>
            <p className="pm-final-footer__brand-text">
              Intelligent project recommendations tailored to your skill level and interests. Find
              your perfect match today.
            </p>

            <div className="pm-final-footer__social" aria-label="Social links">
              <a className="pm-final-footer__social-link" href="#" aria-label="GitHub">
                <IconGitHub />
              </a>
              <a className="pm-final-footer__social-link" href="#" aria-label="Twitter">
                <IconTwitter />
              </a>
              <a className="pm-final-footer__social-link" href="#" aria-label="LinkedIn">
                <IconLinkedIn />
              </a>
              <a className="pm-final-footer__social-link" href="#" aria-label="Community">
                <IconGlobe />
              </a>
            </div>
          </div>

          <div className="pm-final-footer__cols">
            {COLUMNS.map((c) => (
              <section key={c.title} className="pm-final-footer__col" aria-label={c.title}>
                <h3 className="pm-final-footer__col-title">{c.title}</h3>
                <ul className="pm-final-footer__links">
                  {c.links.map((label) => (
                    <li key={label}>
                      <a className="pm-final-footer__link" href="#">
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>

        <div className="pm-final-footer__divider" aria-hidden="true" />
        <div className="pm-final-footer__bottom">
          © {new Date().getFullYear()} ProjectMatch. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

function IconGitHub() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M9 19c-4 1.5-4-2-5-2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M14 22v-3.3a2.9 2.9 0 0 0-.9-2.2c3-.3 6.2-1.5 6.2-6.2a5.4 5.4 0 0 0-1.5-3.8A5.1 5.1 0 0 0 18 3s-1 0-3 1a10.6 10.6 0 0 0-6 0c-2-1-3-1-3-1a5.1 5.1 0 0 0-.3 2.5A5.4 5.4 0 0 0 4 9c0 4.7 3.2 5.9 6.2 6.2A2.9 2.9 0 0 0 9 17.7V22"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconTwitter() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path
        d="M22 4s-.7 2.1-2 3.2C21.6 8.2 22 10 22 10s-1.2-.1-2.4-.8c.8 4-2 7.8-6.3 8.2-3.1.3-5.4-1.2-6.3-2.5-.9-1.3-.8-2.8-.8-2.8s1.1.7 2.6.8c-2.3-1.8-2-4.8-2-4.8S8 10 10 10c-.3-3.6 2.6-6 6-5 1.3.3 2 .9 2 .9s1-.1 1-1Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V9h4v2c.9-1.2 2.1-2 4-3Z" />
      <path d="M2 9h4v12H2z" />
      <path d="M4 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
    </svg>
  )
}

function IconGlobe() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />
      <path d="M2 12h20" strokeLinecap="round" />
      <path d="M12 2c3 3.6 3 16.4 0 20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 2c-3 3.6-3 16.4 0 20" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

