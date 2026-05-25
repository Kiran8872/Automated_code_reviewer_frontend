import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { DarkModeProvider } from './context/DarkModeContext';
import { HistoryProvider } from './context/HistoryContext';
import Navbar from './components/Navbar';
import ApiStatusBanner from './components/ApiStatusBanner';

const Home = lazy(() => import('./pages/Home'));
const CodeReviewer = lazy(() => import('./pages/CodeReviewer'));
const ReviewHistory = lazy(() => import('./pages/ReviewHistory'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const About = lazy(() => import('./pages/About'));

const LoadingScreen = () => (
  <div className="min-h-[70vh] flex items-center justify-center text-gray-600 dark:text-gray-300">
    Loading...
  </div>
);

function App() {
  return (
    <DarkModeProvider>
      <HistoryProvider>
        <Router>
          <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-gray-900 dark:text-white transition-colors duration-500 selection:bg-primary-500/30 selection:text-primary-900 dark:selection:text-primary-100">
            <Navbar />
            <ApiStatusBanner />
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/review" element={<CodeReviewer />} />
                <Route path="/history" element={<ReviewHistory />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </HistoryProvider>
    </DarkModeProvider>
  );
}

export default App;
