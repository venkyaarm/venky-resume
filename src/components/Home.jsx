import React from "react";
import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaBrain } from "react-icons/fa";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">
        <span className="brand-name">@Venky</span>
        <span className="brand-sub">Pro Resume App</span>
      </h1>

      <p className="home-subtitle">
        Build ATS-friendly professional resumes and analyze them with smart tools.
      </p>

      <div className="button-group">
        <button className="home-button primary" onClick={() => navigate("/create")}>
          <FaFileAlt /> Create Resume
        </button>

        <button className="home-button secondary" onClick={() => navigate("/analyze")}>
          <FaBrain /> Analyze Resume
        </button>
      </div>

      <footer className="home-footer">
        <span> Venky Resume Tools</span>
      </footer>
    </div>
  );
};

export default Home;
