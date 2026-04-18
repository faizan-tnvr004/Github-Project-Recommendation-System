import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './OnboardingPage.css'

const STEPS = [1, 2, 3, 4]

const LEVELS = [
  {
    value: 'Beginner',
    title: 'Beginner',
    subtitle: 'Just starting out or have less than 1 year of experience',
  },
  {
    value: 'Intermediate',
    title: 'Intermediate',
    subtitle: '1-3 years of experience, comfortable with core concepts',
  },
  {
    value: 'Advanced',
    title: 'Advanced',
    subtitle: '3+ years of experience, looking for complex challenges',
  },
]

const TECH = [
  'React',
  'Python',
  'Node.js',
  'Java',
  'TypeScript',
  'JavaScript',
  'Vue.js',
  'Angular',
  'Django',
  'Flask',
  'Express',
  'Spring Boot',
  'PostgreSQL',
  'MongoDB',
  'Docker',
  'AWS',
  'Git',
  'GraphQL',
]

const GOALS = [
  {
    value: 'Portfolio',
    title: 'Portfolio',
  },
  {
    value: 'Job Prep',
    title: 'Job Prep',
  },
  {
    value: 'Learning',
    title: 'Learning',
  },
]

const TIME = [
  { value: 'Weekends', title: 'Weekends' },
  { value: '5 hours/week', title: '5 hours/week' },
  { value: '10 hours/week', title: '10 hours/week' },
  { value: '20+ hours/week', title: '20+ hours/week' },
]

export function OnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  const [level, setLevel] = useState('')
  const [technologies, setTechnologies] = useState([])
  const [goals, setGoals] = useState([])
  const [time, setTime] = useState('')

  const selectedTechCount = technologies.length
  const selectedGoalsCount = goals.length

  const canContinue = useMemo(() => {
    if (step === 1) return Boolean(level)
    if (step === 2) return selectedTechCount > 0
    if (step === 3) return selectedGoalsCount > 0
    if (step === 4) return Boolean(time)
    return false
  }, [level, selectedGoalsCount, selectedTechCount, step, time])

  const next = () => {
    if (!canContinue) return
    if (step < 4) setStep((s) => s + 1)
    if (step === 4) navigate('/recommendations')
  }

  const back = () => {
    if (step > 1) setStep((s) => s - 1)
  }

  return (
    <div className="pm-setup">
      <header className="pm-setup__header" aria-label="ProjectMatch">
        <div className="pm-setup__brand">
          <span className="pm-setup__brand-mark" aria-hidden="true" />
          <span className="pm-setup__brand-name">ProjectMatch</span>
        </div>
      </header>

      <div className="pm-setup__stepper" aria-label={`Setup step ${step} of 4`}>
        <div className="pm-setup__stepper-row">
          {STEPS.map((n, idx) => {
            const isCompleted = step > n
            const isActive = step === n
            const showCheck = isCompleted

            return (
              <div key={n} className="pm-setup__stepper-node">
                <div
                  className={[
                    'pm-setup__step-circle',
                    isActive ? 'pm-setup__step-circle--active' : '',
                    isCompleted ? 'pm-setup__step-circle--done' : '',
                  ].join(' ')}
                >
                  {showCheck ? <span aria-hidden="true">✓</span> : <span>{n}</span>}
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={[
                      'pm-setup__step-line',
                      isCompleted ? 'pm-setup__step-line--done' : '',
                    ].join(' ')}
                    aria-hidden="true"
                  />
                )}
              </div>
            )
          })}
        </div>
        <p className="pm-setup__step-text">Step {step} of 4</p>
      </div>

      <div className="pm-setup__card" role="form" aria-label="Project setup form">
        {step === 1 && (
          <>
            <h1 className="pm-setup__title">What&apos;s your programming level?</h1>
            <p className="pm-setup__subtitle">
              This helps us recommend projects that match your experience
            </p>

            <div className="pm-setup__options">
              {LEVELS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={[
                    'pm-radio-card',
                    level === opt.value ? 'pm-radio-card--selected' : '',
                  ].join(' ')}
                  onClick={() => setLevel(opt.value)}
                  aria-pressed={level === opt.value}
                >
                  <span
                    className={[
                      'pm-radio-dot',
                      level === opt.value ? 'pm-radio-dot--on' : '',
                    ].join(' ')}
                    aria-hidden="true"
                  />
                  <div className="pm-radio-card__text">
                    <div className="pm-radio-card__title">{opt.title}</div>
                    <div className="pm-radio-card__subtitle">{opt.subtitle}</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="pm-setup__title">Select your technologies</h1>
            <p className="pm-setup__subtitle">
              Choose the technologies you want to work with
            </p>

            <div className="pm-setup__section-title">Technologies (Select all that apply)</div>

            <div className="pm-chip-grid" role="group" aria-label="Technologies">
              {TECH.map((t) => {
                const active = technologies.includes(t)
                return (
                  <button
                    key={t}
                    type="button"
                    className={[
                      'pm-chip',
                      active ? 'pm-chip--active' : '',
                    ].join(' ')}
                    aria-pressed={active}
                    onClick={() => {
                      setTechnologies((prev) =>
                        prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
                      )
                    }}
                  >
                    {t}
                  </button>
                )
              })}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="pm-setup__title">Select your goals</h1>
            <p className="pm-setup__subtitle">Choose your learning goals</p>

            <div className="pm-setup__section-title">
              What are your goals? (Select all that apply)
            </div>

            <div className="pm-setup__goal-options">
              {GOALS.map((opt) => {
                const active = goals.includes(opt.value)
                return (
                  <button
                    key={opt.value}
                    type="button"
                    className={['pm-radio-card', active ? 'pm-radio-card--selected' : ''].join(
                      ' '
                    )}
                    aria-pressed={active}
                    onClick={() => {
                      setGoals((prev) =>
                        prev.includes(opt.value) ? prev.filter((x) => x !== opt.value) : [...prev, opt.value]
                      )
                    }}
                  >
                    <span
                      className={[
                        'pm-radio-dot',
                        active ? 'pm-radio-dot--on' : '',
                      ].join(' ')}
                      aria-hidden="true"
                    />
                    <div className="pm-radio-card__text">
                      <div className="pm-radio-card__title">{opt.title}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h1 className="pm-setup__title">How much time can you commit?</h1>
            <p className="pm-setup__subtitle">This helps us recommend projects that fit your schedule</p>

            <div className="pm-setup__options">
              {TIME.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={[
                    'pm-radio-card',
                    time === opt.value ? 'pm-radio-card--selected' : '',
                  ].join(' ')}
                  aria-pressed={time === opt.value}
                  onClick={() => setTime(opt.value)}
                >
                  <span
                    className={[
                      'pm-radio-dot',
                      time === opt.value ? 'pm-radio-dot--on' : '',
                    ].join(' ')}
                    aria-hidden="true"
                  />
                  <div className="pm-radio-card__text">
                    <div className="pm-radio-card__title">{opt.title}</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        <div className="pm-setup__footer">
          <button type="button" className="pm-setup__back" onClick={back} disabled={step === 1}>
            Back
          </button>
          <button
            type="button"
            className="pm-setup__continue"
            onClick={next}
            disabled={!canContinue}
          >
            {step === 4 ? 'Complete Setup' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  )
}

