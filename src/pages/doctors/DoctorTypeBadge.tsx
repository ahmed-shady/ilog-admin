import React from 'react';
import { Badge } from 'react-bootstrap';
import DoctorTypeEnum from '@app/types/DoctorTypeEnum';
import './DoctorTypeBadge.scss';

interface DoctorTypeBadgeProps {
  type: DoctorTypeEnum;
}

const DoctorTypeBadge: React.FC<DoctorTypeBadgeProps> = ({ type }) => {
  const getVariantAndIcon = (doctorType: DoctorTypeEnum) => {
    switch (doctorType) {
      case DoctorTypeEnum.CONSULTANT:
        return {
          variant: 'consultant',
          icon: 'fa-user-md',
          label: 'Consultant'
        };
      case DoctorTypeEnum.SPECIALIST:
        return {
          variant: 'specialist',
          icon: 'fa-stethoscope',
          label: 'Specialist'
        };
      case DoctorTypeEnum.TRAINEE:
        return {
          variant: 'trainee',
          icon: 'fa-user-graduate',
          label: 'Trainee'
        };

        case DoctorTypeEnum.HOSPITAL:
        return {
          variant: 'hospital',
          icon: 'fa-building',
          label: 'Hospital'
        };
      default:
        return {
          variant: 'secondary',
          icon: 'fa-user',
          label: type
        };
    }
  };

  const { variant, icon, label } = getVariantAndIcon(type);

  return (
    <Badge 
      bg={variant as any} 
      className={`doctor-type-badge doctor-type-${variant}`}
    >
      <i className={`fas ${icon} me-1`}></i>
      {label}
    </Badge>
  );
};

export default DoctorTypeBadge;
