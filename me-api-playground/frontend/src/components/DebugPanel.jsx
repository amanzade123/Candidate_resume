// frontend/src/components/DebugPanel.jsx
import React, { useState, useEffect } from 'react';
import { API_BASE, getAuthHeader } from '../api';

export default function DebugPanel(){
  const [out, setOut] = useState('');
  const [skill, setSkill] = useState('');
  const [query, setQuery] = useState('');
  const [projId, setProjId] = useState('');
  const [projTitle, setProjTitle] = useState('');
  const [projDescription, setProjDescription] = useState('');
  const [projLinks, setProjLinks] = useState('');
  const [projSkills, setProjSkills] = useState('');
  const [attachToProfile, setAttachToProfile] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/profile`).then(r=>r.json()).then(p=>{
      if (p && p.id) setProfile(p);
    }).catch(()=>{});
  }, []);

  async function call(path, opts){
    try {
      const res = await fetch(`${API_BASE}${path}`, opts);
      const json = await res.json().catch(()=>null);
      setOut(JSON.stringify(json ?? 'No JSON response', null, 2));
      return { ok: res.ok, json };
    } catch (e) {
      setOut(String(e));
      return { ok:false, json:null };
    }
  }

  function buildProjectPayload() {
    const payload = {};
    if (projTitle.trim()) payload.title = projTitle.trim();
    if (projDescription.trim()) payload.description = projDescription.trim();
    if (projLinks.trim()) payload.links = projLinks.trim();
    if (projSkills.trim()) payload.skills = projSkills.split(',').map(s=>s.trim()).filter(Boolean);
    if (attachToProfile && profile && profile.id) payload.profileId = profile.id;
    return payload;
  }

  async function createOrUpdateProject() {
    const payload = buildProjectPayload();
    if (!projId.trim()) {
      if (!payload.title) {
        setOut('Please provide a Title to create a project.');
        return;
      }
      const headers = { 'Content-Type': 'application/json', ...getAuthHeader() };
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      const json = await res.json().catch(()=>null);
      setOut((res.ok ? `Created project ${json?.id}\n\n` : `Error:\n`) + JSON.stringify(json, null, 2));
      // refresh profile view in case attached
      if (res.ok && attachToProfile && profile && profile.id) {
        const prof = await fetch(`${API_BASE}/profile`).then(r=>r.json()).catch(()=>null);
        setProfile(prof);
        setOut(prev => prev + '\n\nProfile refreshed.');
      }
    } else {
      if (Object.keys(payload).length === 0) {
        setOut('No fields provided — nothing to update. Provide fields to change.');
        return;
      }
      const id = projId.trim();
      const headers = { 'Content-Type': 'application/json', ...getAuthHeader() };
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload)
      });
      const json = await res.json().catch(()=>null);
      setOut((res.ok ? `Updated project ${id}\n\n` : `Error:\n`) + JSON.stringify(json, null, 2));
      if (res.ok && attachToProfile && profile && profile.id) {
        const prof = await fetch(`${API_BASE}/profile`).then(r=>r.json()).catch(()=>null);
        setProfile(prof);
      }
    }
  }

  return (
    <div className="card">
      <h3>Admin Panel — API Debug & Projects</h3>

      <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center',marginBottom:8}}>
        <button className="btn btn-primary" onClick={()=>call('/health')}>GET /health</button>
        <button className="btn" onClick={()=>call('/profile')}>GET /profile</button>
        <button className="btn" onClick={()=>call('/projects')}>GET /projects</button>

        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <input placeholder="skill (e.g. python)" value={skill} onChange={e=>setSkill(e.target.value)} />
          <button className="btn" onClick={()=>call(`/projects?skill=${encodeURIComponent(skill)}`)}>GET /projects?skill=...</button>
        </div>

        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <input placeholder="search query" value={query} onChange={e=>setQuery(e.target.value)} />
          <button className="btn" onClick={()=>call(`/search?q=${encodeURIComponent(query)}`)}>GET /search?q=...</button>
        </div>

        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <button className="btn btn-ghost" onClick={()=>call('/skills/top')}>GET /skills/top</button>
        </div>
      </div>

      <div style={{marginTop:8}}>
        <h4 style={{margin:'8px 0'}}>Create / Update Project</h4>
        <div style={{display:'grid',gap:8}}>
          <input placeholder="Project ID (leave blank to CREATE)" value={projId} onChange={e=>setProjId(e.target.value)} />
          <input placeholder="Title (leave blank to keep previous on update)" value={projTitle} onChange={e=>setProjTitle(e.target.value)} />
          <input placeholder="Description (leave blank to keep previous on update)" value={projDescription} onChange={e=>setProjDescription(e.target.value)} />
          <input placeholder='Links (JSON or "github=https://...,demo=https://...") (leave blank to keep previous)' value={projLinks} onChange={e=>setProjLinks(e.target.value)} />
          <input placeholder='Skills (comma separated, e.g. python,react) (leave blank to keep previous)' value={projSkills} onChange={e=>setProjSkills(e.target.value)} />

          <label style={{display:'flex',alignItems:'center',gap:8}}>
            <input type="checkbox" checked={attachToProfile} onChange={e=>setAttachToProfile(e.target.checked)} />
            Attach this project to your seeded profile {profile && profile.name ? `(${profile.name})` : '(no profile found)'}
          </label>

          <div style={{display:'flex',gap:8}}>
            <button className="btn btn-primary" onClick={createOrUpdateProject}>
              {projId.trim() ? 'Update Project (PUT)' : 'Create Project (POST)'}
            </button>
            <button className="btn btn-ghost" onClick={()=>{
              setProjId(''); setProjTitle(''); setProjDescription(''); setProjLinks(''); setProjSkills('');
            }}>Clear fields</button>
          </div>
        </div>
      </div>

      <div style={{marginTop:12}}>
        <pre style={{whiteSpace:'pre-wrap',maxHeight:360,overflow:'auto',background:'#0f172a1a',padding:12,borderRadius:8}}>
          {out || 'response will appear here'}
        </pre>
      </div>
    </div>
  );
}
