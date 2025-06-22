import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ResumeBuilder from './components/ResumeBuilder';
import ResumeAnalyzer from './components/ResumeAnalyzer';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<ResumeBuilder />} />
        <Route path="/analyze" element={<ResumeAnalyzer />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
