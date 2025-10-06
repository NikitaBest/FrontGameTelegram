import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import WebApp from '@twa-dev/sdk'

function Bootstrap() {
  useEffect(() => {
    try {
      WebApp.ready()
      WebApp.expand()
    } catch {}
  }, [])
  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Bootstrap />
  </StrictMode>,
)
