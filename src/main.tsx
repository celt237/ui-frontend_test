import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize theme from localStorage before rendering
const initializeTheme = () => {
  try {
    const themeStorage = localStorage.getItem('theme-storage');
    if (themeStorage) {
      const parsed = JSON.parse(themeStorage);
      // Zustand persist stores data in 'state' property
      const theme = parsed?.state?.theme || parsed?.theme || 'light';
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  } catch (error) {
    // If there's an error, default to light mode
    document.documentElement.classList.remove('dark');
  }
};

// Apply theme before rendering
initializeTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

