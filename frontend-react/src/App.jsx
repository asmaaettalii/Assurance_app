import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BlockchainProvider } from './context/BlockchainContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import InsurerPage from './pages/InsurerPage';
import InsuredPage from './pages/InsuredPage';

function App() {
  return (
    <BlockchainProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/insurer" element={<InsurerPage />} />
            <Route path="/insured" element={<InsuredPage />} />
          </Routes>
        </Layout>
      </Router>
    </BlockchainProvider>
  );
}

export default App;
