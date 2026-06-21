import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import React from 'react';
import { AppShell } from './App.jsx';

// IMPORTANT: render the same shell the client hydrates with (App.jsx →
// AppShell wrapped in BrowserRouter). Previously this file only rendered
// AppRoutes, which meant the SSR HTML omitted ScrollToTop, ExitIntent and
// CookieConsent. The client then hydrated a different tree, producing 5
// React #418 hydration errors per page load.
export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <AppShell />
    </StaticRouter>
  );
}
