import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppProviders } from './providers'
import AppRouter from './routing/AppRouter'
import { ErrorBoundary } from '@/shared/ui'
import '@fontsource-variable/inter'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <ErrorBoundary>
        <AppRouter />
      </ErrorBoundary>
    </AppProviders>
  </StrictMode>,
)
