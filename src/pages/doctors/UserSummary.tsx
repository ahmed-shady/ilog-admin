import React from 'react';
import { BASE_URL } from '@app/api/axios';
import { formatDateTime } from '@app/utils/DateUtil';
import './UserSummary.scss';

interface UserSummaryProps {
  name: string;
  profileImage?: string | null;
  registeredAt?: Date | string;
  highlight?: string;
}

const UserSummary: React.FC<UserSummaryProps> = ({ 
  name, 
  profileImage, 
  registeredAt,
  highlight 
}) => {
  const imageUrl = profileImage 
    ? `${BASE_URL}${profileImage}` 
    : '/img/default-profile.png';

  const highlightText = (text: string, searchTerm?: string) => {
    if (!searchTerm || !text) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="highlight">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="user-summary">
      <img 
        src={imageUrl} 
        alt={name}
        className="user-summary-avatar"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/img/default-profile.png';
        }}
      />
      <div className="user-summary-info">
        <div className="user-summary-name">
          {highlightText(name, highlight)}
        </div>
        {registeredAt && (
          <small className="user-summary-date text-muted">
            {formatDateTime(new Date(registeredAt))}
          </small>
        )}
      </div>
    </div>
  );
};

export default UserSummary;
