import '@fontsource-variable/inter';
import './styles/index.css';
import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App';
import { initAnalytics } from './utils/analytics';

const root = document.getElementById('root');
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Production pages are prerendered to HTML, so we hydrate them; in dev we render from scratch.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);

initAnalytics();
