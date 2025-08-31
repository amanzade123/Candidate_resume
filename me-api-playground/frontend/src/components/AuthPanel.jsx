// frontend/src/components/AuthPanel.jsx
import React, { useState, useEffect } from 'react';
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

function b64(u,p){ try { return btoa(`${u}:${p}`); } catch(e){ return ''; } }

export default function AuthPanel(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(()=>{
    const token = localStorage.getItem('me_api_auth');
    if (token) {
      setLoggedIn(true);
      setUser(localStorage.getItem('me_api_user') || null);
    }
  }, []);

  async function login(){
    setMsg('Logging in...');
    const token = b64(username, password);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        headers: { Authorization: `Basic ${token}` }
      });
      if (!res.ok) {
        setMsg('Login failed');
        setLoggedIn(false);
        return;
      }
      const json = await res.json();
      localStorage.setItem('me_api_auth', token);
      localStorage.setItem('me_api_user', username);
      setUser(json.user || username);
      setLoggedIn(true);
      setUsername(''); setPassword('');
      setMsg('Logged in');
    } catch (err) {
      setMsg('Error: ' + String(err));
      setLoggedIn(false);
    }
  }

  function logout(){
    localStorage.removeItem('me_api_auth');
    localStorage.removeItem('me_api_user');
    setLoggedIn(false);
    setUser(null);
    setMsg('Logged out');
  }

  return (
    <div className="card">
      <h4>Admin Login</h4>
      { loggedIn ? (
        <div>
          <div className="small">Logged in as <strong>{user}</strong></div>
          <div style={{marginTop:8}}>
            <button className="btn btn-ghost" onClick={logout}>Logout</button>
            <span style={{marginLeft:12}} className="small">{msg}</span>
          </div>
        </div>
      ) : (
        <div style={{display:'grid',gap:8}}>
          <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
          <input placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} type="password" />
          <div style={{display:'flex',gap:8}}>
            <button className="btn btn-primary" onClick={login}>Login</button>
            <div className="small" style={{alignSelf:'center'}}>{msg}</div>
          </div>
          <div className="small">Default: admin / changeme (unless changed in backend .env)</div>
        </div>
      )}
    </div>
  );
}
