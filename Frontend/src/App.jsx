import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Prediction from './pages/Prediction';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import AIAnalytics from './pages/AIAnalytics';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/predict" element={<Prediction />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />
          <Route path="/analytics" element={<AIAnalytics />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
