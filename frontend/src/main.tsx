import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppProviders, AppRouter } from '@/app'
import { ErrorBoundary } from '@/shared/ui'
import '@fontsource-variable/inter'
import '@/app/styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <ErrorBoundary>
        <AppRouter />
      </ErrorBoundary>
    </AppProviders>
  </StrictMode>,
)
