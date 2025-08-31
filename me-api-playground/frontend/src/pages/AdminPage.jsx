import React from 'react';
import DebugPanel from '../components/DebugPanel';
import ProfileEditor from '../components/ProfileEditor';
import ProjectList from '../components/ProjectList';
import AuthPanel from '../components/AuthPanel';



export default function AdminPage(){
  return (
    <div className="grid">
      <div>      
        <AuthPanel />
        <DebugPanel />
        <div style={{marginTop:12}}>
          <ProfileEditor />
        </div>
      </div>
      <aside>
        <div className="card">
          <h4>All Projects (Admin)</h4>
          <ProjectList />
        </div>
      </aside>
    </div>
  );
}
