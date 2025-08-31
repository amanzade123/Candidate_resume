import React, { useEffect, useState } from 'react';
import { getProjects } from '../api';

export default function ProjectList(){
  const [projects, setProjects] = useState([]);
  useEffect(()=>{ getProjects().then(setProjects).catch(()=>{}); }, []);
  return (
    <div>
      <h3>All Projects</h3>
      <ul>
        {projects.map(p => (
          <li key={p.id}>
            <strong>{p.title}</strong> — {p.description}
            {p.links && (<div>Links: {Object.entries(p.links).map(([k,v]) => <a key={k} href={v} target="_blank" style={{marginLeft:8}}>{k}</a>)}</div>)}
            {p.skills && <div>Skills: {p.skills.map(s=>s.name).join(', ')}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}
