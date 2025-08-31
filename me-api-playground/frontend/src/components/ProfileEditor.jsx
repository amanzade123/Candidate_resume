import React, { useState, useEffect } from 'react';
import { API_BASE, getAuthHeader } from '../api';

export default function ProfileEditor(){
  const [original, setOriginal] = useState(null);
  const [form, setForm] = useState({
    name: '', email: '', education: '', github: '', linkedin: '', portfolio: '', skills: ''
  });
  const [message, setMessage] = useState('');

  useEffect(()=> {
    fetch(`${API_BASE}/profile`).then(r=>r.json()).then(p=>{
      if (p && p.id) {
        setOriginal(p);
        setForm({ name:'', email:'', education:'', github:'', linkedin:'', portfolio:'', skills:'' });
        setMessage('');
      } else {
        setOriginal(null);
      }
    }).catch(()=>{ setOriginal(null); });
  }, []);

  function buildPayload() {
    const payload = {};
    if (!original) {
      if (form.name.trim()) payload.name = form.name.trim();
      if (form.email.trim()) payload.email = form.email.trim();
      if (form.education.trim()) payload.education = form.education.trim();
      if (form.github.trim()) payload.github = form.github.trim();
      if (form.linkedin.trim()) payload.linkedin = form.linkedin.trim();
      if (form.portfolio.trim()) payload.portfolio = form.portfolio.trim();
      if (form.skills.trim()) payload.skills = form.skills.split(',').map(s=>({name:s.trim()}));
      return payload;
    }
    if (form.name.trim() && form.name.trim() !== original.name) payload.name = form.name.trim();
    if (form.email.trim() && form.email.trim() !== original.email) payload.email = form.email.trim();
    if (form.education.trim() && form.education.trim() !== original.education) payload.education = form.education.trim();
    if (form.github.trim() && form.github.trim() !== (original.github||'')) payload.github = form.github.trim();
    if (form.linkedin.trim() && form.linkedin.trim() !== (original.linkedin||'')) payload.linkedin = form.linkedin.trim();
    if (form.portfolio.trim() && form.portfolio.trim() !== (original.portfolio||'')) payload.portfolio = form.portfolio.trim();
    if (form.skills.trim()) payload.skills = form.skills.split(',').map(s=>({name:s.trim()}));
    return payload;
  }

  async function save(e){
    e.preventDefault();
    const payload = buildPayload();
    if (Object.keys(payload).length === 0) {
      setMessage('No changes to save. Fill fields you want to change.');
      return;
    }
    setMessage('Saving...');
    const method = original && original.id ? 'PUT' : 'POST';
    const headers = { 'Content-Type':'application/json', ...getAuthHeader() };
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method,
        headers,
        body: JSON.stringify(payload)
      });
      const json = await res.json().catch(()=>null);
      if (!res.ok) {
        setMessage('Error: ' + JSON.stringify(json));
      } else {
        setMessage('Saved successfully');
        const prof = await fetch(`${API_BASE}/profile`).then(r=>r.json()).catch(()=>null);
        if (prof && prof.id) {
          setOriginal(prof);
          setForm({ name:'', email:'', education:'', github:'', linkedin:'', portfolio:'', skills:'' });
        }
      }
    } catch (err) {
      setMessage('Error: ' + String(err));
    }
  }

  const placeholders = {
    name: original ? original.name : 'Name',
    email: original ? original.email : 'Email',
    education: original ? original.education : 'Education',
    github: original ? original.github : 'Github URL',
    linkedin: original ? original.linkedin : 'LinkedIn URL',
    portfolio: original ? original.portfolio : 'Portfolio URL',
    skills: original ? (original.skills || []).map(s=>s.name||s).join(', ') : 'Skills (comma separated)'
  };

  return (
    <div className="card">
      <h3>{original ? 'Edit Profile' : 'Create Profile'}</h3>
      <form onSubmit={save}>
        <div style={{display:'grid',gap:8}}>
          <input placeholder={placeholders.name} value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <input placeholder={placeholders.email} value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
          <input placeholder={placeholders.education} value={form.education} onChange={e=>setForm({...form, education:e.target.value})} />
          <input placeholder={placeholders.github} value={form.github} onChange={e=>setForm({...form, github:e.target.value})} />
          <input placeholder={placeholders.linkedin} value={form.linkedin} onChange={e=>setForm({...form, linkedin:e.target.value})} />
          <input placeholder={placeholders.portfolio} value={form.portfolio} onChange={e=>setForm({...form, portfolio:e.target.value})} />
          <input placeholder={placeholders.skills} value={form.skills} onChange={e=>setForm({...form, skills:e.target.value})} />
          <div style={{display:'flex',gap:8}}>
            <button className="btn btn-primary" type="submit">Save Profile</button>
            <div className="small" style={{alignSelf:'center'}}>{message}</div>
          </div>
        </div>
      </form>
    </div>
  );
}
