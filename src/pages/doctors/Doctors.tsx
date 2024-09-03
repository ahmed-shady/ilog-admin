import { Badge, Button, ButtonGroup, Card, Dropdown, DropdownButton, Modal, Table } from 'react-bootstrap';
import './Doctors.scss'
import { act, useEffect, useState } from 'react';
import { Loading } from '@app/components/loading/Loading';

import { listDoctors, unverifyDoctor, verifyDoctor } from '@app/api/DoctorsService';
import DoctorTypeEnum from '@app/types/DoctorTypeEnum';
import Doctor from '@app/types/Doctor';
import DoctorDetails from './DoctorDetails';
import DoctorsDocuments from './DoctorsDocuments';
import { deleteUser, suspendUser, unsuspendUser } from '@app/api/UsersService';

const DOCTOR_TYPES_TEXT: any = {};

DOCTOR_TYPES_TEXT[DoctorTypeEnum.TRAINEE] = "Trainee";
DOCTOR_TYPES_TEXT[DoctorTypeEnum.CONSULTANT] = "Consultant";
DOCTOR_TYPES_TEXT[DoctorTypeEnum.TRAINEE_AND_CONSULTANT] = "Trainee and Consultant";

interface Confirmation {
  title?: string
  message?: any,
  callback?: any
}
const Doctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
  const [showDetailsModal, setShowDetailsModel] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showConfirmModal, setshowConfirmModal] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation>({ message: <>Are you sure you want to proceed?</>, title: "Confirmation" });
  const [isLoading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const closeAllModals = () => {
    setCurrentDoctor(null);
    setshowConfirmModal(false);
    setShowDocumentsModal(false);
    setShowDetailsModel(false);
  }

  const showDetails = (doctor: Doctor) => {
    closeAllModals();
    setCurrentDoctor(doctor);
    setShowDetailsModel(true);
  }
  const showDocuments = (doctor: Doctor) => {
    closeAllModals();
    setCurrentDoctor(doctor);
    setShowDocumentsModal(true);
  }

  const toggleSuspend = async (doctor: Doctor) => {
    closeAllModals();
    setActionLoading(true);
    setCurrentDoctor(doctor);

    try {
      if (doctor.user.suspended)
        await unsuspendUser(doctor.user.id);
      else
        await suspendUser(doctor.user.id);
      
      doctor.user.suspended = !doctor.user.suspended;

    } catch (error) {
    }
    setActionLoading(false);
  }

  const toggleVerify = async (doctor: Doctor) => {
    setActionLoading(true);
    setCurrentDoctor(doctor);
    try {
      if (doctor.verified)
        await unverifyDoctor(doctor.id);
      else
        await verifyDoctor(doctor.id);

      doctor.verified = !doctor.verified;
    } catch (error) {
    }
    setActionLoading(false);
  }



  const initiateDelete = async (doctor: Doctor) => {
    setCurrentDoctor(doctor);
    setConfirmation({
      title: "Confirm Delete",
      message: <>Are you sure You want to delete user <strong>{doctor.name}</strong> completely?</>,
      callback: async () => {
        closeAllModals();
        await deleteUser(doctor.id);
        setDoctors(doctors.filter(doc => doc.id !== doctor.id))
      }
    })
    setshowConfirmModal(true);
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await listDoctors();
      return data;
    }
    fetchData().then(doctors => {
      setDoctors(doctors);
      setLoading(false);

    }).catch((error: any) => {
      setLoading(false);

    });
  }, []);

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      {showDetailsModal && currentDoctor && <DoctorDetails show={showDetailsModal} doctor={currentDoctor} close={closeAllModals} toggleVerify={toggleVerify} showDocuments={showDocuments} actionLoading={actionLoading} />}
      {showDocumentsModal && currentDoctor && <DoctorsDocuments show={showDocumentsModal} close={closeAllModals} doctor={currentDoctor} />}

      {/* @ts-ignore */}
      {showConfirmModal && currentDoctor &&
        <Modal show={showConfirmModal} close={closeAllModals}>
          {/* @ts-ignore */}
          <Modal.Header closeButton>
            <Modal.Title>{confirmation?.title || "Confirm your action"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{confirmation?.message || "Are you sure you want to proceed?"}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeAllModals}>
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmation?.callback || (() => { })}>
              Ok
            </Button>
          </Modal.Footer>
        </Modal>
      }
      <Card className="card">
        <Card.Header><h3><i className="fas fa-solid fa-user-md doctor-icon"></i> Doctors</h3></Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-end">
            <Button variant="info" className="excel-btn" title="export data">Export <i className="fas fa-file-excel"></i></Button>
          </div>
          <table className="table table-bordered table-striped table-responsive-lg">
            <thead>
              <tr>
                <th className="text-center" scope="col">#</th>
                <th className="text-center" scope="col">Name</th>
                <th className="text-center" scope="col">Email</th>
                <th className="text-center" scope="col">Trainee/Consultant</th>
                {/* <th className="text-center" scope="col">Identity</th>
            <th className="text-center" scope="col">Phone</th> */}
                <th className="text-center" scope="col">Address</th>
                <th className="text-center" scope="col">Speciality</th>
                <th className="text-center" scope="col">Hospital</th>
                <th className="text-center" scope="col">Verified</th>
                <th className="text-center" scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>

              {doctors.map((doctor, idx) => (
                <tr className={`text-center ${doctor?.user.suspended ? 'doctor-suspended' : ''}`} key={idx}>
                  <th className="text-center" scope="row">{idx}</th>
                  <td className="text-cener">{doctor.user.name}</td>
                  <td className="text-cener">{doctor.user.email}</td>
                  <td className="text-center">{DOCTOR_TYPES_TEXT[doctor.type]}</td>
                  {/* <td className='text-center'>{doctor.identity?.id || "unknown"}</td>
            <td className='text-center'>{doctor.phoneNumber}</td> */}
                  <td className='text-center'>{doctor.state ? `${doctor.state} - ${doctor.country}` : doctor.country}</td>
                  <td className='text-center'>{doctor.speciality.name}</td>
                  <td className='text-center'>{doctor.hospital || ""}</td>
                  <td className='text-center'><li className={`text-lg fas ${doctor?.verified ? 'fa-check-circle text-success' : 'fa-times-circle text-danger'}`}></li></td>
                  <td className='text-center'>
                    <ButtonGroup size="sm" className="action-group">
                      <Button type="button" title="view Details" className="action-btn btn btn-success" onClick={() => { showDetails(doctor) }}>
                        <i className="fas fa-eye"></i>
                      </Button>
                      <button type="button" title="view Documents" className="action-btn btn btn-danger" onClick={() => { showDocuments(doctor) }}><i className="fas fa-solid fa-file-invoice"></i></button>

                      {(actionLoading && currentDoctor?.id === doctor.id) ?
                        <Button type="button" title="view Details" className="action-btn btn">
                          <div className="spinner-grow spinner-grow-sm" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                        </Button>
                        :
                        <DropdownButton size="sm" as={ButtonGroup} title="" id="bg-nested-dropdown">
                          <Dropdown.Item eventKey="1" className="dropdown-item" onClick={() => toggleVerify(doctor)}>{doctor.verified ? 'UnVerify' : 'Verify'}</Dropdown.Item>
                          <Dropdown.Item eventKey="2" className="dropdown-item" onClick={() => { toggleSuspend(doctor) }}>{doctor.user.suspended ? 'UnSuspend' : 'Suspend'}</Dropdown.Item>
                          <Dropdown.Item eventKey="2" className="dropdown-item" onClick={() => { initiateDelete(doctor) }}>Delete</Dropdown.Item>
                        </DropdownButton>
                      }
                    </ButtonGroup>
                  </td>
                </tr>
              ))
              }

            </tbody>
          </table>
        </Card.Body>
      </Card>


    </>
  )
}

export default Doctors;