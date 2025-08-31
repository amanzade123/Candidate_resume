import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ResumePage from './pages/ResumePage';
import AdminPage from './pages/AdminPage';
import './style.css';

export default function App(){
  return (
    <Router>
      <div className="app">
        <header className="header-row card" style={{marginBottom:16}}>
          <div>
            <h1>Me-API Playground</h1>
            <p className="lead">Minimal UI — search skills, list projects, view profile</p>
          </div>
          <nav style={{display:'flex',gap:8}}>
            <Link to="/" className="btn btn-ghost">Resume</Link>
            <Link to="/admin" className="btn btn-primary">Admin</Link>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<ResumePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>

        <footer className="footer small">Use /admin to create/update projects and profile</footer>
      </div>
    </Router>
  );
}
