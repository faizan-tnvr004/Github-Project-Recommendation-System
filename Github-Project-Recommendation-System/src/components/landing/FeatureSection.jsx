import './FeatureSection.css'

const ITEMS = [
  {
    id: 'difficulty',
    title: 'Smart Difficulty Matching',
    description:
      'Our AI-powered algorithm analyzes your coding experience and matches you with projects at the perfect difficulty level. No more feeling lost or bored—just the right challenge every time.',
    iconVariant: 'purple-pink',
    Icon: IconTarget,
  },
  {
    id: 'tech-filter',
    title: 'Technology-Based Filtering',
    description:
      "Filter projects by your preferred languages, frameworks, and tools. Whether you're a React expert or exploring new technologies, find exactly what you're looking for.",
    iconVariant: 'pink-purple',
    Icon: IconCode,
  },
  {
    id: 'github',
    title: 'GitHub Integration',
    description:
      'Seamlessly connect your GitHub account to automatically sync your skills and project history. Our system learns from your contributions to provide even better recommendations.',
    iconVariant: 'blue',
    Icon: IconGitHub,
  },
]

export function FeatureSection() {
  return (
    <section
      className="pm-features-section"
      id="features"
      aria-labelledby="pm-features-main-title"
    >
      <div className="pm-features-section__container">
        <header className="pm-features-section__header">
          <p className="pm-features-section__eyebrow">Features</p>
          <h2 id="pm-features-main-title" className="pm-features-section__title">
            Everything you need to find your next project
          </h2>
          <p className="pm-features-section__lead">
            Powerful features designed to help you discover and engage with projects that match your
            skills and goals.
          </p>
        </header>

        <ul className="pm-features-section__grid">
          {ITEMS.map(({ id, title, description, iconVariant, Icon }) => (
            <li key={id}>
              <article className="pm-detail-card">
                <div
                  className={`pm-detail-card__icon pm-detail-card__icon--${iconVariant}`}
                  aria-hidden="true"
                >
                  <Icon />
                </div>
                <h3 className="pm-detail-card__title">{title}</h3>
                <p className="pm-detail-card__text">{description}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function IconTarget() {
  return (
    <svg className="pm-detail-card__svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  )
}

function IconCode() {
  return (
    <svg className="pm-detail-card__svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 7L4 12l4 5M16 7l4 5-4 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 5.5L10.5 18.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconGitHub() {
  return (
    <svg className="pm-detail-card__svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.014-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.481C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"
      />
    </svg>
  )
}
