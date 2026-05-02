import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Loader from './components/Loader';

// Lazy load pages for performance optimization
const Home = lazy(() => import('./pages/Home'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const SubredditDetail = lazy(() => import('./pages/SubredditDetail'));

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <main style={{ padding: '20px', minHeight: 'calc(100vh - 72px)' }}>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/analytics/:subredditId" element={<SubredditDetail />} />
              <Route path="*" element={<div style={{ padding: '24px', textAlign: 'center' }}><h2>Page not found.</h2></div>} />
            </Routes>
          </Suspense>
        </main>
      </Router>
    </ThemeProvider>
  );
}

export default App;
