import { Badge, Button, ButtonGroup, Card, Dropdown, DropdownButton, Form, InputGroup, Modal, Pagination, Table } from 'react-bootstrap';
import './Doctors.scss'
import React, { act, useEffect, useMemo, useRef, useState } from 'react';
import { Loading } from '@app/components/loading/Loading';

import { searchDoctors, unverifyDoctor, verifyDoctor } from '@app/api/DoctorsService';
import DoctorTypeEnum from '@app/types/DoctorTypeEnum';
import Doctor from '@app/types/Doctor';
import DoctorDetails from './doctor-details';
import DoctorsDocuments from './doctors-documents';
import DoctorTypeBadge from './DoctorTypeBadge';
import UserSummary from './UserSummary';
import { deleteUser, suspendUser, unsuspendUser } from '@app/api/UsersService';
import DoctorsFilter from './DoctorsFilter';
import { DoctorFilterDto } from '@app/types/DoctorFilterDto';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ColValueFormatter from './ColValueFormatter';

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
  const [searchValue, setSearchValue] = useState<string>();
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [t] = useTranslation();

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

  useEffect(() => {
    setSearchValue(filterDto.query);
  }, [filterDto.query]);

  const submitSearch = () => {
    setFilterDto({ query: searchValue });
  }

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
    for (const value of Object.values(filterDto)) {
      if (value !== null) {
        return true;
      }
    }
    return false;
  }, [filterDto]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle direction: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      // New column, start with asc
      setSortColumn(column);
      setSortDirection('asc');
    }
    
    // TODO: Call your API with sortColumn and sortDirection
    // loadData(0, column, direction);
  };

  const SortableHeader = ({ column, children }: { column: string; children: React.ReactNode }) => {
    const isActive = sortColumn === column;
    const direction = isActive ? sortDirection : null;
    
    return (
      <th 
        className={`sortable-header ${isActive ? 'active' : ''}`}
        onClick={() => handleSort(column)}
      >
        <div className="sortable-header-content">
          <span>{children}</span>
          <span className="sort-icons">
            {!direction && <i className="fas fa-sort text-muted"></i>}
            {direction === 'asc' && <i className="fas fa-sort-up text-primary"></i>}
            {direction === 'desc' && <i className="fas fa-sort-down text-primary"></i>}
          </span>
        </div>
      </th>
    );
  };

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
      {isLoading && <Loading />}
      <Card className="doctors-main-card">
        <Card.Header className="doctors-header">
          <div className="d-flex justify-content-between align-items-center w-100">
            <div className="d-flex align-items-center">
              <div className="header-icon-wrapper">
                <i className="fas fa-user-md"></i>
              </div>
              <div className="ms-3">
                <h3 className="mb-0">Doctors Management</h3>
                <p className="text-muted mb-0 small">{totalElements} registered doctors</p>
              </div>
            </div>
          </div>
        </Card.Header>
        <Card.Body className="doctors-body">
          <div className="doctors-controls mb-4">
            <div className="row g-3 align-items-center">
              <div className="col-12 col-md-6">
                <Form onSubmit={(e) => {e.preventDefault(); submitSearch();}}>
                  <InputGroup className="search-input-group">
                    <InputGroup.Text className="search-icon">
                      <i className="fas fa-search"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search by name, email, hospital..."
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className="search-control"
                    />
                    <Button variant="primary" type='submit' className="search-button">
                      Search
                    </Button>
                  </InputGroup>
                </Form>
              </div>
              <div className="col-12 col-md-6">
                <div className="d-flex justify-content-md-end gap-2">
                  <DropdownButton 
                    title={<><i className='fas fa-sort me-2'/>Sort By</>} 
                    variant="outline-secondary"
                    className="sort-dropdown"
                  >
                    <Dropdown.Item eventKey="1">Name A-Z</Dropdown.Item>
                    <Dropdown.Item eventKey="2">Date (Newest)</Dropdown.Item>
                    <Dropdown.Item eventKey="3">Date (Oldest)</Dropdown.Item>
                  </DropdownButton>

                  <Button 
                    variant="outline-primary" 
                    className='filter-button position-relative' 
                    onClick={() => { setShowFilters(true); }}
                  >
                    <i className="fas fa-filter me-2"></i>
                    Filters
                    {hasFilters && <span className="filter-indicator"></span>}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="table-responsive">
            <Table hover className="doctors-table align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{width: '50px'}}>#</th>
                  <SortableHeader column="name">Name</SortableHeader>
                  <SortableHeader column="email">Email</SortableHeader>
                  <SortableHeader column="type">Type</SortableHeader>
                  <SortableHeader column="speciality">Speciality</SortableHeader>
                  <SortableHeader column="location">Location</SortableHeader>
                  <SortableHeader column="hospital">Hospital</SortableHeader>
                  <th style={{width: '100px'}} className="text-center">Status</th>
                  <th style={{width: '150px'}} className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor, idx) => (
                  <tr key={idx} className={doctor?.suspended ? 'table-secondary' : ''}>
                    <td className="text-muted">{currentPage * 15 + idx + 1}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <UserSummary 
                          name={doctor.name}
                          profileImage={doctor.profileImage}
                          registeredAt={doctor.registeredAt}
                          highlight={filterDto.query}
                        />
                        {doctor.verified && (
                          <i className="fas fa-check-circle text-success" title="Verified"></i>
                        )}
                      </div>
                    </td>
                    <td>
                      <small>
                        <ColValueFormatter value={doctor.email} highlight={filterDto.query} />
                      </small>
                    </td>
                    <td>
                      <DoctorTypeBadge type={doctor.type} />
                    </td>
                    <td>{doctor.speciality?.name || "-"}</td>
                    <td>
                      <small>
                        {doctor.state && <ColValueFormatter value={doctor.state + ", "} highlight={filterDto.query} />}
                        <ColValueFormatter value={doctor.country} highlight={filterDto.query} />
                      </small>
                    </td>
                    <td>
                      <small className="text-muted">
                        {doctor.hospital || '-'}
                      </small>
                    </td>
                    <td className="text-center">
                      {doctor.suspended && (
                        <Badge bg="danger" pill>
                          Suspended
                        </Badge>
                      )}
                    </td>
                    <td className="sticky-actions">
                      <ButtonGroup size="sm" className="action-buttons">
                        <Button 
                          variant="outline-primary" 
                          onClick={() => showDetails(doctor)}
                          title="View Details"
                          className="btn-action"
                        >
                          <i className="fas fa-eye"></i>
                        </Button>
                        <Button 
                          variant="outline-info" 
                          onClick={() => showDocuments(doctor)}
                          title="Documents"
                          className="btn-action"
                        >
                          <i className="fas fa-file-alt"></i>
                        </Button>
                        
                        {(actionLoading && currentDoctor?.id === doctor.id) ? (
                          <Button variant="outline-secondary" disabled className="btn-action">
                            <span className="spinner-border spinner-border-sm"></span>
                          </Button>
                        ) : (
                          <DropdownButton
                            as={ButtonGroup}
                            variant="outline-secondary"
                            title={<i className='fas fa-ellipsis-v'/>}
                            className="btn-more"
                            drop="start"
                          >
                            <Dropdown.Item onClick={() => toggleVerify(doctor)}>
                              <i className={`fas ${doctor.verified ? 'fa-times-circle' : 'fa-check-circle'} me-2`}></i>
                              {doctor.verified ? 'Unverify' : 'Verify'}
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => toggleSuspend(doctor)}>
                              <i className={`fas ${doctor.suspended ? 'fa-play' : 'fa-pause'} me-2`}></i>
                              {doctor.suspended ? 'Unsuspend' : 'Suspend'}
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={() => initiateDelete(doctor)} className="text-danger">
                              <i className="fas fa-trash me-2"></i>
                              Delete
                            </Dropdown.Item>
                          </DropdownButton>
                        )}
                      </ButtonGroup>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {doctors.length === 0 && !isLoading && <NoDoctorsFound />}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-4 pagination-wrapper">
              <div className="pagination-info">
                Showing {currentPage * 15 + 1} to {Math.min((currentPage + 1) * 15, totalElements)} of {totalElements} doctors
              </div>
              <Pagination className='modern-pagination mb-0'>
                <Pagination.First 
                  onClick={() => pageNumberChange(0)} 
                  disabled={currentPage === 0}
                />
                <Pagination.Prev 
                  onClick={() => pageNumberChange(currentPage - 1)} 
                  disabled={currentPage === 0}
                />
                
                {Array.from({length: totalPages}, (_, i) => i)
                  .filter(number => {
                    // Show first page, last page, current page, and pages around current
                    return number === 0 || 
                           number === totalPages - 1 || 
                           (number >= currentPage - 2 && number <= currentPage + 2);
                  })
                  .map((number, index, array) => {
                    // Add ellipsis
                    if (index > 0 && number - array[index - 1] > 1) {
                      return [
                        <Pagination.Ellipsis key={`ellipsis-${number}`} disabled />,
                        <Pagination.Item 
                          key={number} 
                          active={number === currentPage} 
                          onClick={() => pageNumberChange(number)}
                        >
                          {number + 1}
                        </Pagination.Item>
                      ];
                    }
                    return (
                      <Pagination.Item 
                        key={number} 
                        active={number === currentPage} 
                        onClick={() => pageNumberChange(number)}
                      >
                        {number + 1}
                      </Pagination.Item>
                    );
                  })}
                
                <Pagination.Next 
                  onClick={() => pageNumberChange(currentPage + 1)} 
                  disabled={currentPage === totalPages - 1}
                />
                <Pagination.Last 
                  onClick={() => pageNumberChange(totalPages - 1)} 
                  disabled={currentPage === totalPages - 1}
                />
              </Pagination>
            </div>
          )}

        </Card.Body>
      </Card>
    </div>
  )
}



const NoDoctorsFound = React.memo(() => {
  return <div className="text-center py-5">
            <i className="fas fa-user-md fa-3x text-muted mb-3"></i>
            <h5 className="text-muted">No doctors found</h5>
            <p className="text-muted">Try adjusting your search or filters</p>
          </div>;
});

export default Doctors;