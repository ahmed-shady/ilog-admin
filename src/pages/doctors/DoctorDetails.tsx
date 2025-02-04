import { useEffect, useMemo, useState } from 'react';
import { Alert, Form, InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './Doctors.scss'


import * as Yup from 'yup';
import DoctorTypeEnum from '@app/types/DoctorTypeEnum';
import { getCountryByName } from '@app/api/CountryService';
import { Country } from '@app/types/Country';
import { BASE_URL } from '@app/api/axios';

const DoctorDetails = ({ show, doctor, close, toggleVerify, showDocuments, actionLoading }: any) => {
  const [showAlert, setShowAlert] = useState(false);
  const [loadingCountry, setLoadingCountry] = useState(false);
  const [country, setCountry] = useState<Country | null>(null);

  const profileImage = useMemo(() => {
    return doctor.profileImage ? `${BASE_URL}${doctor.profileImage}` : '/img/default-profile.png';
  }, [doctor.profileImage]);
  useEffect(() => {
    const fetchData = async (countryName: string) => {
      const data = await getCountryByName(countryName);
      return data;
    }
    doctor?.country && fetchData(doctor.country).then(country => {
      setCountry(country);
      setLoadingCountry(false);

    }).catch((error: any) => {
      setLoadingCountry(false);

    });
  }, []);

  return (
    <>
      <Modal show={show} onHide={close}>
        {/* @ts-ignore */}
        <Modal.Header closeButton>
          <Modal.Title><strong>{doctor.name}</strong> details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form id="doctor-form">
            <InputGroup className="mb-3">
              <Form.Label className='col-sm-4 align-center'>Name</Form.Label>
              <InputGroup className='col-sm-8'>
                <Form.Control
                  id="name"
                  name="name"
                  type="text"
                  value={doctor?.name || "unknown"}
                  onChange={() => { }}
                />
                <InputGroup.Append>
                  <InputGroup.Text>
                    <i className="fas fa-info-circle" />
                  </InputGroup.Text>
                </InputGroup.Append>

              </InputGroup>
            </InputGroup>
            <InputGroup className="mb-3">
              <Form.Label className='col-sm-4 align-center'>Inerested As</Form.Label>
              <InputGroup className='col-sm-8'>
                <select
                  id="doctorType"
                  name="doctorType"
                  className="form-control"
                  value={doctor?.type || "unknown"}
                  onChange={() => { }}
                >
                  <option value={DoctorTypeEnum.TRAINEE}>Trainee</option>
                  <option value={DoctorTypeEnum.CONSULTANT}>Consultant</option>
                  <option value={DoctorTypeEnum.TRAINEE_AND_CONSULTANT}>Trainee and Consultant</option>
                </select>
                <InputGroup.Append>
                  <InputGroup.Text>
                    <i className="fas fa-user-md" />
                  </InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
            </InputGroup>

            <InputGroup className="mb-3">
              <Form.Label className='col-sm-4 align-center'>Speciality</Form.Label>
              <InputGroup className='col-sm-8'>
                <Form.Control
                  id="speciality"
                  name="speciality"
                  type="text"
                  value={doctor?.speciality?.name || "unknown"}
                  onChange={() => { }}
                />
                <InputGroup.Append>
                  <InputGroup.Text>
                    <i className="fas fa-medkit" />
                  </InputGroup.Text>
                </InputGroup.Append>

              </InputGroup>
            </InputGroup>

            <InputGroup className="mb-3">
              <Form.Label className='col-sm-4 align-center'>Hospital</Form.Label>
              <InputGroup className='col-sm-8'>
                <Form.Control
                  id="hospital"
                  name="hospital"
                  type="text"
                  value={doctor?.hospital || "unknown"}
                  onChange={() => { }}
                />
                <InputGroup.Append>
                  <InputGroup.Text>
                    <i className="fas fa-hospital" />
                  </InputGroup.Text>
                </InputGroup.Append>

              </InputGroup>
            </InputGroup>

            <hr />

            <InputGroup className="mb-3">
              <Form.Label className='col-sm-4 align-center'>Address</Form.Label>
              <InputGroup className='col-sm-8'>
                {doctor?.state &&
                  <Form.Control
                    className={`col-sm-7`}
                    id="state"
                    name="state"
                    type="text"
                    value={doctor?.state || "unknown"}
                    onChange={() => { }}
                  />
                }
                <Form.Control
                  className={`col-sm-${doctor?.state ? 5 : 12}`}
                  id="country"
                  name="country"
                  type="text"
                  value={doctor?.country || "unknown"}
                  onChange={() => { }}
                />
                <InputGroup.Append>
                  {country?.image ?
                    <InputGroup.Text className="country-append-text">
                      <img src={country.image} className="img-responsive country-image" />
                    </InputGroup.Text>
                    :
                    <InputGroup.Text className="country-append">
                      <i className="fas fa-map-marker" />
                    </InputGroup.Text>
                  }
                </InputGroup.Append>
              </InputGroup>
            </InputGroup>

            <InputGroup className="mb-3">
              <Form.Label className='col-sm-4 align-center'>Phone</Form.Label>
              <InputGroup className='col-sm-8'>
                {country?.dialCode &&
                  <InputGroup.Prepend>
                    <InputGroup.Text className="country-prepend-code">
                      <strong>{country?.dialCode}</strong>
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                }
                <Form.Control
                  id="phone"
                  name="phone"
                  type="text"
                  value={doctor?.phoneNumber?.substring(country?.dialCode?.length || 0) || "unknown"}
                  onChange={() => { }}
                />
                <InputGroup.Append>
                  <InputGroup.Text>
                    <i className="fas fa-phone" />
                  </InputGroup.Text>
                </InputGroup.Append>

              </InputGroup>
            </InputGroup>
            <hr />
            <InputGroup className="mb-3">
              <Form.Label className='col-sm-4 align-center'>Image</Form.Label>
              <div className="col-sm-8 d-flex align-items-center">
                <img src={profileImage} className="mx-auto doctor-image" />
              </div>
            </InputGroup>
          </form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={close}>
            Close
          </Button>
          <Button disabled={actionLoading} variant={doctor.verified ? "danger" : "info"} onClick={() => toggleVerify(doctor)}>
            {doctor.verified ? 'UnVerify' : 'Verify'}
          </Button>
          <Button disabled={actionLoading} variant='warning' onClick={() => showDocuments(doctor)}>View Documents</Button>

        </Modal.Footer>
      </Modal>
    </>

  );

}

export default DoctorDetails;