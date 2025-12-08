import React from 'react';
import { Button } from 'react-bootstrap';
import './MapPopup.scss';

interface MapPopupProps {
  title: string;
  count: number;
  type: 'country' | 'state';
  onClose: () => void;
  onStates?: () => void;
  onDetails: () => void;
}

const MapPopup: React.FC<MapPopupProps> = ({
  title,
  count,
  type,
  onClose,
  onStates,
  onDetails
}) => {
  return (
    <div className="map-popup">
      <button 
        type="button" 
        className="map-popup-close" 
        onClick={onClose}
        aria-label="Close"
      >
        <i className="fas fa-times"></i>
      </button>
      
      <div className="map-popup-header">
        <i className={`fas ${type === 'country' ? 'fa-globe-americas' : 'fa-map-marker-alt'} map-popup-icon`}></i>
        <h6 className="map-popup-title">{title}</h6>
      </div>
      
      <div className="map-popup-count">
        <span className="count-number">{count}</span>
        <span className="count-label">doctors</span>
      </div>
      
      <div className="map-popup-actions">
        {type === 'country' && onStates && (
          <Button 
            variant="outline-primary" 
            size="sm" 
            onClick={onStates}
            className="map-popup-btn"
          >
            <i className="fas fa-map me-1"></i>
            States
          </Button>
        )}
        <Button 
          variant="primary" 
          size="sm" 
          onClick={onDetails}
          className="map-popup-btn"
        >
          <i className="fas fa-info-circle me-1"></i>
          Details
        </Button>
      </div>
    </div>
  );
};

export default MapPopup;
