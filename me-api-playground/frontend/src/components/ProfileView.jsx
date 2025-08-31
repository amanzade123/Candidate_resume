import React, { useEffect, useState } from 'react';
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export default function ProfileView({ showCompact = false }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/profile`)
      .then(r => r.json())
      .then(p => {
        setProfile(p);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="card">Loading profile...</div>;
  if (!profile) return <div className="card empty">No profile found.</div>;

  const initials = profile.name ? profile.name.split(' ').map(n => n[0]).slice(0,2).join('') : 'ME';

  return (
    <div className="profile-root">
      <div className="profile-top">
        <div className="avatar">{initials}</div>
        <div style={{flex:1, marginLeft:16}}>
          <h2 style={{margin:0}}>{profile.name}</h2>
          <div className="small" style={{marginTop:6}}>{profile.email}</div>
          <div style={{marginTop:10}} className="small"><strong>Education:</strong> {profile.education}</div>

          {/* summary area */}
          <div style={{marginTop:12}} className="small">
            {profile.summary ? profile.summary : null}
          </div>

          {/* Links moved to bottom of summary block */}
          <div style={{marginTop:12}} className="profile-links">
            {profile.github && <div><a href={profile.github} target="_blank" rel="noreferrer">GitHub</a></div>}
            {profile.linkedin && <div><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></div>}
            {profile.portfolio && <div><a href={profile.portfolio} target="_blank" rel="noreferrer">Portfolio</a></div>}
          </div>

          {/* Skills at the bottom of summary */}
          <div style={{marginTop:14}}>
            <strong>Skills</strong>
            <div style={{marginTop:8}}>
              {(profile.skills || []).length === 0 ? <span className="small">No skills listed</span> :
                (profile.skills || []).map((s, i) => (
                  <span key={i} className={`badge ${i%2? 'accent':''}`} style={{marginRight:8}}>{s.name || s}</span>
                ))
              }
            </div>
          </div>
        </div>
      </div>

      <div className="profile-body">
        <section className="card centered-section">
          <h3 style={{textAlign:'center'}}>Work Experience</h3>
          {profile.work && profile.work.length > 0 ? (
            <ul className="work-list" style={{listStyle:'none', padding:0}}>
              {profile.work.map(w => (
                <li key={w.id || `${w.company}-${w.role}`} className="project-item" style={{maxWidth:820, margin:'0 auto'}}>
                  <div style={{display:'flex', justifyContent:'space-between', gap:12}}>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700}}>{w.role} <span className="small">@ {w.company}</span></div>
                      <div className="small">{w.startDate || ''} {w.endDate ? ` — ${w.endDate}` : ''}</div>
                      {w.description && <div className="project-desc" style={{marginTop:6}}>{w.description}</div>}
                    </div>
                    <div style={{minWidth:120, textAlign:'right'}}>
                      {w.links && typeof w.links === 'object' && Object.keys(w.links).map(k => (
                        <div key={k}><a href={w.links[k]} target="_blank" rel="noreferrer">{k}</a></div>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : <div className="empty">No work experience listed.</div>}
        </section>

        <section className="card centered-section" style={{marginTop:12}}>
          <h3 style={{textAlign:'center'}}>Projects</h3>
          {profile.projects && profile.projects.length > 0 ? (
            <div style={{display:'grid', gap:12}}>
              {profile.projects.map(p => (
                <div key={p.id} className="project-item" style={{maxWidth:820, margin:'0 auto'}}>
                  <div style={{display:'flex', justifyContent:'space-between', gap:12}}>
                    <div style={{flex:1}}>
                      <div className="project-title">{p.title}</div>
                      <div className="project-desc">{p.description}</div>
                      <div style={{marginTop:8}}>
                        {(p.skills || []).map((s, idx) => <span key={idx} className="badge green">{s.name || s}</span>)}
                      </div>
                    </div>
                    <div style={{minWidth:120, textAlign:'right'}}>
                      {p.links && typeof p.links === 'object' ? Object.entries(p.links).map(([k,v]) => (
                        <div key={k}><a href={v} target="_blank" rel="noreferrer">{k}</a></div>
                      )) : (p.links && typeof p.links === 'string' ? <div className="small">{p.links}</div> : null)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : <div className="empty">No projects listed on this profile.</div>}
        </section>
      </div>
    </div>
  );
}
