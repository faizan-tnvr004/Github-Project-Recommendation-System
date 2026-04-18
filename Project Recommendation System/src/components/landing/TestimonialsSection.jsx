import './TestimonialsSection.css'

const TESTIMONIALS = [
  {
    id: 'sarah',
    quote:
      'This platform helped me find projects that were perfect for my skill level. I went from feeling overwhelmed to shipping features confidently in just a few weeks.',
    name: 'Sarah Chen',
    role: 'Frontend Developer at Tech Startup',
    avatarClass: 'pm-t-card__avatar--1',
  },
  {
    id: 'michael',
    quote:
      'The technology-based filtering is a game changer. I can now focus on React projects that align with my expertise while exploring new libraries at my own pace.',
    name: 'Michael Rodriguez',
    role: 'Full Stack Engineer at Digital Agency',
    avatarClass: 'pm-t-card__avatar--2',
  },
  {
    id: 'emily',
    quote:
      'GitHub integration made onboarding seamless. The system immediately understood my experience level and recommended projects that challenged me without being frustrating.',
    name: 'Emily Watson',
    role: 'Software Developer at SaaS Company',
    avatarClass: 'pm-t-card__avatar--3',
  },
]

export function TestimonialsSection() {
  return (
    <section
      className="pm-testimonials"
      id="testimonials"
      aria-labelledby="pm-testimonials-title"
    >
      <div className="pm-testimonials__container">
        <header className="pm-testimonials__header">
          <p className="pm-testimonials__eyebrow">Testimonials</p>
          <h2 id="pm-testimonials-title" className="pm-testimonials__title">
            Loved by developers worldwide
          </h2>
          <p className="pm-testimonials__lead">
            See what our community has to say about finding their perfect projects.
          </p>
        </header>

        <ul className="pm-testimonials__grid">
          {TESTIMONIALS.map((t) => (
            <li key={t.id}>
              <blockquote className="pm-t-card">
                <span className="pm-t-card__quote-icon" aria-hidden="true">
                  “
                </span>
                <p className="pm-t-card__quote">{t.quote}</p>
                <footer className="pm-t-card__footer">
                  <span className={`pm-t-card__avatar ${t.avatarClass}`} aria-hidden="true" />
                  <div className="pm-t-card__meta">
                    <cite className="pm-t-card__name">{t.name}</cite>
                    <span className="pm-t-card__role">{t.role}</span>
                  </div>
                </footer>
              </blockquote>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
