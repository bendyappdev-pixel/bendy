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

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
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
          <Route path="/category/:category" element={<CategoryPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
