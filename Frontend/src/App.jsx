import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Prediction from './pages/Prediction';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import { LoadingProvider } from './context/LoadingContext';
import { DataProvider } from './context/DataContext';
import GlobalLoader from './components/GlobalLoader';

const AIAnalytics = React.lazy(() => import('./pages/AIAnalytics'));

function App() {
  return (
    <Router>
      <LoadingProvider>
        <DataProvider>
          <GlobalLoader />
          <Layout>
          <React.Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#FCFCFD]">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Initialising Neural Bridge...</p>
              </div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/predict" element={<Prediction />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/about" element={<About />} />
              <Route path="/analytics" element={<AIAnalytics />} />
            </Routes>
          </React.Suspense>
        </Layout>
        </DataProvider>
      </LoadingProvider>
    </Router>
  );
}

export default App;
