import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/prs-app.css'
import App from './App.jsx'
import { applyThemeToDocument, readStoredTheme } from './utils/theme.js'

applyThemeToDocument(readStoredTheme())

const rootEl = document.getElementById('root')
if (!rootEl) {
  throw new Error('Missing #root element in index.html')
}

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
)