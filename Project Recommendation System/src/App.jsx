import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { LandingPage } from './pages/LandingPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { HomePage } from './pages/HomePage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { RecommendationsPage } from './pages/RecommendationsPage'
import { SavedProjectsPage } from './pages/SavedProjectsPage'
import { ProfilePage } from './pages/ProfilePage'
import { SettingsPage } from './pages/SettingsPage'

function NotFoundPage() {
  return (
    <div className="prs-empty">
      <h1>Page not found</h1>
      <p>The route you opened does not exist.</p>
      <Link to="/" className="prs-button prs-button--primary">
        Go home
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="onboarding" element={<OnboardingPage />} />
        <Route element={<MainLayout />}>
          <Route path="dashboard" element={<HomePage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:id" element={<ProjectDetailPage />} />
          <Route path="recommendations" element={<RecommendationsPage />} />
          <Route path="saved" element={<SavedProjectsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="home" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
