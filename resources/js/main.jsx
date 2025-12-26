import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { ToastProvider } from './components/Toast'
import App from './app.jsx'
import './index.css'

// Hide page loading screen when React mounts
const hidePageLoading = () => {
  const loadingScreen = document.getElementById('page-loading-screen');
  if (loadingScreen && loadingScreen.style.display !== 'none') {
    loadingScreen.style.animation = 'fadeOut 0.3s ease-in-out forwards';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 300);
  }
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <ToastProvider>
        <App />
      </ToastProvider>
    </Router>
  </React.StrictMode>,
)

// Hide loading screen after React renders
setTimeout(hidePageLoading, 100);
