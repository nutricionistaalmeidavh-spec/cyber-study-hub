import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import './components/lesson-editorial.css';
import './components/hub-editorial.css';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/academy/sw.js',{scope:'/academy/'}).catch(() => undefined));
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

import './components/study-experience.css';
import './components/hub-secondary-pages.css';
