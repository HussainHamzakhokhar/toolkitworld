import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ConsentBanner from '../components/ConsentBanner';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => { if (!hash) window.scrollTo(0, 0); }, [pathname, hash]);
  return null;
}

export function PageLoading() {
  return (
    <div className="container page-loading" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" /> <span>Loading…</span>
    </div>
  );
}

export default function MainLayout() {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Header />
      <ScrollToTop />
      <main id="main" tabIndex={-1}>
        <Suspense fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <ConsentBanner />
    </>
  );
}
