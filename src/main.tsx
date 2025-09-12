import React, { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from './pages/App'
import './index.css'
import './i18n'; // Import the i18n configuration

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense fallback="Loading...">
      <App />
    </Suspense>
  </React.StrictMode>
);
