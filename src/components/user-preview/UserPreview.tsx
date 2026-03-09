import React from 'react';
import './UserPreview.scss';
import { BASE_URL } from '@app/api/axios';

interface User {
  id?: number;
  name: string;
  email: string;
  profileImage?: string;
}

interface UserPreviewProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
}

const UserPreview: React.FC<UserPreviewProps> = ({ user, size = 'md' }) => {
    const profileImage = user.profileImage && user.profileImage.trim() !== '' ?
     `${BASE_URL}${user.profileImage}` : '/img/default-profile.png';
  return (
    <div className={`user-preview user-preview-${size}`}>
      <img 
        src={profileImage} 
        alt={user.name}
        className="user-preview-avatar"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/img/default-profile.png';
        }}
      />
      <div className="user-preview-info">
        <div className="user-preview-name">{user.name}</div>
        <div className="user-preview-email">{user.email}</div>
      </div>
    </div>
  );
};

export default UserPreview;
