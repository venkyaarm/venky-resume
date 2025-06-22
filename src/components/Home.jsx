import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFileAlt, FaBrain, FaMoon, FaSun } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
  }, [darkMode]);

  return (
    <main className={`home-container ${darkMode ? 'dark' : ''}`}>
      <div className="theme-toggle">
        <button className="theme-button" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle Dark Mode">
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      <motion.h1
        className="home-title"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <span className="floating gradient-text">@Venky</span>{' '}
        <span className="gradient-text">Pro Resume App</span>
      </motion.h1>

      <motion.div
        className="button-group"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
      >
        <motion.button
          className="home-button"
          onClick={() => navigate('/create')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaFileAlt className="icon" /> Create Resume
        </motion.button>

        <motion.button
          className="home-button"
          onClick={() => navigate('/analyze')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaBrain className="icon" /> Analyze Resume
        </motion.button>
      </motion.div>
    </main>
  );
};

export default Home;
