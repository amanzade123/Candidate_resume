// frontend/src/components/SkillsTop.jsx
import React, { useEffect, useState } from 'react';
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export default function SkillsTop(){
  const [skills, setSkills] = useState([]);
  useEffect(()=> {
    fetch(`${API_BASE}/skills/top`).then(r=>r.json()).then(setSkills).catch(()=>{});
  }, []);
  return (
    <div className="card">
      <h4>Top Skills (by project usage)</h4>
      {skills.length === 0 ? <div className="empty">No skills yet.</div> :
      <ul>
        {skills.map(s => <li key={s.id}>{s.name} — {s.count}</li>)}
      </ul>}
    </div>
  );
}
