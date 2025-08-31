import React from 'react';
import ProfileView from '../components/ProfileView';

export default function ResumePage(){
  return (
    <div>
      <div className="resume-hero card">
        <ProfileView showCompact={false} />
      </div>
    </div>
  );
}
