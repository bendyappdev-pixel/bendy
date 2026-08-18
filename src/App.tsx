import { useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import HistoryPage from './pages/HistoryPage';
import MapPage from './pages/MapPage';
import CategoryPage from './pages/CategoryPage';
import GuidesPage from './pages/GuidesPage';
import GuideDetailPage from './pages/GuideDetailPage';
import CampingPage from './pages/CampingPage';
import TrailsPage from './pages/TrailsPage';
import TrailDetailPage from './pages/TrailDetailPage';
import ConditionsPage from './pages/ConditionsPage';
import NotFoundPage from './pages/NotFoundPage';

/** Document scroll progress rendered as a 2px film scrubber at the viewport
    top — the site's "runtime". Hidden under prefers-reduced-motion (CSS). */
function RuntimeBar() {
  const fillRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (fillRef.current) fillRef.current.style.width = `${(progress * 100).toFixed(2)}%`;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="runtime-bar" aria-hidden="true">
      <i ref={fillRef} />
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <RuntimeBar />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/guides/:slug" element={<GuideDetailPage />} />
          <Route path="/camping" element={<CampingPage />} />
          <Route path="/trails" element={<TrailsPage />} />
          <Route path="/trails/:slug" element={<TrailDetailPage />} />
          <Route path="/conditions" element={<ConditionsPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          {/* Catch-all. Without this an unrecognised URL rendered the shell
              around an empty <main> with no explanation and no way back. */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
