import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

console.log('=== KAI App Starting ===')
console.log('Root element:', document.getElementById('root'))

const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('❌ Root element not found!')
  document.body.innerHTML = '<h1>ERROR: Root element not found!</h1>'
} else {
  console.log('✅ Root element found, mounting app...')
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  )
  console.log('✅ App mounted successfully')
}
