import { Badge, Button, ButtonGroup, Card, Dropdown, DropdownButton, Form, InputGroup, Modal, Pagination, Table } from 'react-bootstrap';
import './Doctors.scss'
import { act, useEffect, useMemo, useRef, useState } from 'react';
import { Loading } from '@app/components/loading/Loading';

import { searchDoctors, unverifyDoctor, verifyDoctor } from '@app/api/DoctorsService';
import DoctorTypeEnum from '@app/types/DoctorTypeEnum';
import Doctor from '@app/types/Doctor';
import DoctorDetails from './DoctorDetails';
import DoctorsDocuments from './DoctorsDocuments';
import { deleteUser, suspendUser, unsuspendUser } from '@app/api/UsersService';
import DOCTOR_TYPES_TEXT from './util/DoctorTypesText';
import DoctorsFilter from './DoctorsFilter';
import TopDoctors from './TopDoctors';
import { DoctorFilterDto } from '@app/types/DoctorFilterDto';
import { useLocation } from 'react-router-dom';
import { formatDateTime } from '@app/utils/DateUtil';

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
  const location: any = useLocation();
  const [showFilters, setShowFilters] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [filterDto, setFilterDto] = useState<DoctorFilterDto>(location.state || {});



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
      if (doctor.suspended)
        await unsuspendUser(doctor.id);
      else
        await suspendUser(doctor.id);

      doctor.suspended = !doctor.suspended;

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
    loadData(0);
  }, [filterDto]);

  const loadData = (pageNumber: number) => {
    setLoading(true);
    searchDoctors(filterDto, pageNumber, 15).then(page => {
      setDoctors(page.content);
      setTotalPages(page.totalPages);
      setTotalElements(page.totalElements);
      setCurrentPage(pageNumber);
      setShowFilters(!!location.state);


    }).finally(() => {
      setLoading(false);

    });
  }

  useEffect(() => {
    setFilterDto(location.state || {});
  }, [location]); // Dependency array listens for changes in location

  const asideRef = useRef(null);

  const handleClickOutside = (event: any) => {
    /*@ts-ignore*/
    if (asideRef.current && !asideRef.current.contains(event.target) && showFilters) {
      closeFilters();
    }
  };

  const closeFilters = () => { setShowFilters(false); setLoading(false); }

  // useEffect(() => {
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, []);

  const pageNumberChange = (pageNumber: number) => {
    loadData(pageNumber);
  }

  const hasFilters = useMemo(() => {
    for(const value of Object.values(filterDto)){
      if(value !== null){
        return true;
      }
    }
    return false;
  }, [filterDto]);
  return (
    <div onClick={handleClickOutside}>
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
      <DoctorsFilter asideRef={asideRef} showFilters={showFilters} close={closeFilters} filterDto={filterDto} setFilterDto={setFilterDto} />
      {isLoading ?
        <Loading />
        :
        <Card className="card">
          <Card.Header><h3><i className="fas fa-solid fa-user-md page-icon"></i> Doctors</h3></Card.Header>
          <Card.Body>
            {/* <TopDoctors doctors={[{ name: 'ahmed ali' }, { name: 'Mohammed Abduallah' }, { name: 'Ali Ahmed Ali' },]} /> */}
            <div className="d-flex global-actions justify-content-end align-items-end">
              <ButtonGroup>
                <Button variant="success" className="excel-btn" title="export data">
                  <i className="fas fa-file-excel"> Export</i>
                </Button>
                <Button variant="warning" className='filter-btn' title="Filter" onClick={() => { setShowFilters(true); }}>
                  <i className="fas fa-filter"> Filter</i>
                  {hasFilters && <span className="indicator"></span>}
                </Button>
              </ButtonGroup>
            </div>
            <div className="table-responsive">
            <Table className="table-bordered table-striped">
              <thead>
                <tr>
                  <th className="text-center" scope="col">#</th>
                  <th className="text-center" scope="col">Name</th>
                  <th className="text-center" scope="col">Email</th>
                  <th className="text-center" scope="col">Registered At</th>
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
                  <tr className={`text-center ${doctor?.suspended ? 'doctor-suspended' : ''}`} key={idx}>
                    <th className="text-center" scope="row">{currentPage * 15 + idx + 1}</th>
                    <td className="text-cener">{doctor.name}</td>
                    <td className="text-cener">{doctor.email}</td>
                    <td className='text-center'>{formatDateTime(new Date(doctor.registeredAt))}</td>
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
                          <DropdownButton drop="left" title={<i className='fas fa-cog' />} size="sm" as={ButtonGroup} id="bg-nested-dropdown" className="no-caret">
                            <Dropdown.Item eventKey="1" className="dropdown-item m-0" onClick={() => toggleVerify(doctor)}>{doctor.verified ? 'UnVerify' : 'Verify'}</Dropdown.Item>
                            <Dropdown.Item eventKey="2" className="dropdown-item m-0" onClick={() => { toggleSuspend(doctor) }}>{doctor.suspended ? 'UnSuspend' : 'Suspend'}</Dropdown.Item>
                            <Dropdown.Item eventKey="2" className="dropdown-item m-0" onClick={() => { initiateDelete(doctor) }}>Delete</Dropdown.Item>
                          </DropdownButton>
                        }
                      </ButtonGroup>
                    </td>
                  </tr>
                ))
                }

              </tbody>
            </Table>
            </div>
            <p><strong>{totalElements}</strong> total users</p>
            <Pagination className='mt-3'>
              {Array(totalPages).fill(0).map((_, number) =>
                <Pagination.Item key={number} active={number === currentPage} onClick={() => pageNumberChange(number)}>
                  {number + 1}
                </Pagination.Item>
              )}
            </Pagination>

          </Card.Body>
        </Card>

      }
    </div>
  )
}

export default Doctors;