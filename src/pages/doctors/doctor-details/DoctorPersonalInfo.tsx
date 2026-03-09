import { Badge, Card, Col, Row } from 'react-bootstrap';
import './DoctorDetails.scss';

import DoctorTypeEnum from '@app/types/DoctorTypeEnum';

import Doctor from '@app/types/Doctor';
import DoctorTypeBadge from '../DoctorTypeBadge';

interface PersonalInformationProps {
  doctor: Doctor;

}

const DoctorPersonalInfo: React.FC<PersonalInformationProps> = ({ doctor }) => {



  const getDoctorTypeVariant = (type: string) => {
    switch (type) {
      case DoctorTypeEnum.CONSULTANT: return 'primary';
      case DoctorTypeEnum.SPECIALIST: return 'success';
      case DoctorTypeEnum.TRAINEE: return 'info';
      default: return 'secondary';
    }
  };

  const getDoctorTypeLabel = (type: string) => {
    return type?.charAt(0).toUpperCase() + type?.slice(1).toLowerCase();
  };

  return (
          <Card className="mb-3 border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <h6 className="mb-0 text-primary">
                <i className="fas fa-id-card me-2"></i>
                Personal Information
              </h6>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col xs={4} className="text-muted">
                  <small>Full Name</small>
                </Col>
                <Col xs={8}>
                  <strong>{doctor?.name || '-'}</strong>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col xs={4} className="text-muted">
                  <small>ID/Passport</small>
                </Col>
                <Col xs={8}>
                  <strong>{doctor?.identity?.id || '-'}</strong>
                </Col>
              </Row>
              <Row>
                <Col xs={4} className="text-muted">
                  <small>Type</small>
                </Col>
                <Col xs={8}>
                  <DoctorTypeBadge type={doctor?.type} hideIcon />
                </Col>
              </Row>
            </Card.Body>
          </Card>
  );
}

export default DoctorPersonalInfo;
