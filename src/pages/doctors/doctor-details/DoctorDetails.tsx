import { useEffect, useMemo, useState } from 'react';
import { Badge, Card, Col, Row, Offcanvas } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import './DoctorDetails.scss';

import DoctorTypeEnum from '@app/types/DoctorTypeEnum';
import { getCountryByName } from '@app/api/CountryService';
import { Country } from '@app/types/Country';
import { BASE_URL } from '@app/api/axios';

interface DoctorDetailsProps {
  show: boolean;
  doctor: any;
  close: () => void;
  toggleVerify: (doctor: any) => void;
  showDocuments: (doctor: any) => void;
  actionLoading: boolean;
}

const DoctorDetails: React.FC<DoctorDetailsProps> = ({ 
  show, 
  doctor, 
  close, 
  toggleVerify, 
  showDocuments, 
  actionLoading 
}) => {
  const [country, setCountry] = useState<Country | null>(null);

  const profileImage = useMemo(() => {
    return doctor.profileImage ? `${BASE_URL}${doctor.profileImage}` : '/img/default-profile.png';
  }, [doctor.profileImage]);

  useEffect(() => {
    const fetchData = async (countryName: string) => {
      const data = await getCountryByName(countryName);
      return data;
    }
    if (doctor?.country) {
      fetchData(doctor.country)
      .then(country => {
        setCountry(country);
      });
    }
  }, [doctor?.country]);

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
    <Offcanvas show={show} onHide={close} placement="end" className="doctor-details-offcanvas">
      <Offcanvas.Header closeButton className="border-bottom">
        <Offcanvas.Title className="d-flex align-items-center">
          <i className="fas fa-user-md text-info me-2"></i>
          <span>Doctor Profile</span>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="p-0">
        {/* Profile Header Section */}
        <div className="doctor-profile-header text-center p-4 bg-light border-bottom">
          <div className="position-relative d-inline-block mb-3">
            <img 
              src={profileImage} 
              alt={doctor?.name}
              className="doctor-profile-image rounded-circle shadow"
            />
            {doctor?.verified && (
              <Badge 
                bg="success" 
                className="position-absolute bottom-0 end-0 rounded-circle p-2"
                style={{ width: '32px', height: '32px' }}
              >
                <i className="fas fa-check"></i>
              </Badge>
            )}
          </div>
          <h4 className="mb-2 fw-bold">{doctor?.name || 'Unknown'}</h4>
          <Badge bg={getDoctorTypeVariant(doctor?.type)} className="mb-2 px-3 py-2">
            <i className="fas fa-user-md me-1"></i>
            {getDoctorTypeLabel(doctor?.type)}
          </Badge>
          <p className="text-muted mb-0">
            <i className="fas fa-medkit me-1"></i>
            {doctor?.speciality?.name || 'No speciality'}
          </p>
        </div>

        {/* Details Section */}
        <div className="p-4">
          {/* Personal Information Card */}
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
                  <Badge bg={getDoctorTypeVariant(doctor?.type)} pill>
                    {getDoctorTypeLabel(doctor?.type)}
                  </Badge>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Professional Information Card */}
          <Card className="mb-3 border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <h6 className="mb-0 text-success">
                <i className="fas fa-stethoscope me-2"></i>
                Professional Information
              </h6>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col xs={4} className="text-muted">
                  <small>Speciality</small>
                </Col>
                <Col xs={8}>
                  <strong>
                    <i className="fas fa-medkit text-success me-2"></i>
                    {doctor?.speciality?.name || '-'}
                  </strong>
                </Col>
              </Row>
              <Row>
                <Col xs={4} className="text-muted">
                  <small>Hospital</small>
                </Col>
                <Col xs={8}>
                  <strong>
                    <i className="fas fa-hospital text-danger me-2"></i>
                    {doctor?.hospital || '-'}
                  </strong>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Contact Information Card */}
          <Card className="mb-3 border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <h6 className="mb-0 text-info">
                <i className="fas fa-address-book me-2"></i>
                Contact Information
              </h6>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col xs={4} className="text-muted">
                  <small>Phone</small>
                </Col>
                <Col xs={8}>
                  <strong>
                    <i className="fas fa-phone text-info me-2"></i>
                    {doctor?.phoneNumber || '-'}
                  </strong>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col xs={4} className="text-muted">
                  <small>Location</small>
                </Col>
                <Col xs={8}>
                  <div className="d-flex align-items-center">
                    {country?.image && (
                      <img 
                        src={country.image} 
                        alt={doctor?.country}
                        className="me-2 rounded"
                        style={{ width: '24px', height: '16px', objectFit: 'cover' }}
                      />
                    )}
                    <strong>
                      {doctor?.state && `${doctor.state}, `}
                      {doctor?.country || '-'}
                    </strong>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Status Card */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <h6 className="mb-0 text-warning">
                <i className="fas fa-info-circle me-2"></i>
                Account Status
              </h6>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col xs={4} className="text-muted">
                  <small>Verified</small>
                </Col>
                <Col xs={8}>
                  <Badge bg={doctor?.verified ? 'success' : 'danger'} pill>
                    <i className={`fas fa-${doctor?.verified ? 'check-circle' : 'times-circle'} me-1`}></i>
                    {doctor?.verified ? 'Verified' : 'Not Verified'}
                  </Badge>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>
      </Offcanvas.Body>
      
      {/* Footer Actions */}
      <div className="offcanvas-footer p-3 border-top bg-light">
        <div className="d-grid gap-2">
          <div className="d-flex gap-2">
            <Button 
              variant={doctor?.verified ? "outline-danger" : "outline-success"} 
              disabled={actionLoading}
              onClick={() => toggleVerify(doctor)}
              className="flex-grow-1"
            >
              <i className={`fas fa-${doctor?.verified ? 'user-times' : 'user-check'} me-2`}></i>
              {doctor?.verified ? 'Unverify' : 'Verify'}
            </Button>
            <Button 
              variant="outline-warning" 
              disabled={actionLoading}
              onClick={() => showDocuments(doctor)}
              className="flex-grow-1"
            >
              <i className="fas fa-file-alt me-2"></i>
              Documents
            </Button>
          </div>
          <Button variant="secondary" onClick={close} size="sm">
            <i className="fas fa-times me-2"></i>
            Close
          </Button>
        </div>
      </div>
    </Offcanvas>
  );
}

export default DoctorDetails;
