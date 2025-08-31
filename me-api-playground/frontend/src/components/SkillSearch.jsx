import React, { useState } from 'react';
import { getProjects } from '../api';

export default function SkillSearch() {
  const [q, setQ] = useState('');
  const [projects, setProjects] = useState([]);

  async function onSearch(e) {
    e?.preventDefault();
    const data = await getProjects(`?skill=${encodeURIComponent(q)}`);
    setProjects(data);
  }

  return (
    <div>
      <form onSubmit={onSearch}>
        <input placeholder="Search projects by skill (e.g. python)" value={q} onChange={e=>setQ(e.target.value)} />
        <button type="submit">Search</button>
      </form>

      {projects.length > 0 && (
        <div>
          <h3>Projects matching "{q}"</h3>
          <ul>
            {projects.map(p => (
              <li key={p.id}>
                <strong>{p.title}</strong> — {p.description}
                {p.skills && <div>Skills: {p.skills.map(s=>s.name).join(', ')}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
