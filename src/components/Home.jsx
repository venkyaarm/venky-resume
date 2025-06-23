import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFileAlt, FaBrain, FaMoon, FaSun } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`home-container ${darkMode ? 'dark' : 'light'}`}>
      <div className="theme-toggle">
        <button onClick={toggleDarkMode} className="theme-button">
          {darkMode ? <FaSun /> : <FaMoon />} {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
      <h1 className="home-title">
        <span className="floating">@Venky</span> <span className="gradient-text">Pro Resume App</span>
      </h1>
      <div className="button-group">
        <button className="home-button" onClick={() => navigate('/create')}>
          <FaFileAlt style={{ marginRight: '8px' }} /> Create Resume
        </button>
        <button className="home-button" onClick={() => navigate('/analyze')}>
          <FaBrain style={{ marginRight: '8px' }} /> Analyze Resume
        </button>
      </div>
    </div>
  );
};

export default Home;
