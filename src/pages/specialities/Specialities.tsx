import { Badge, Button, ButtonGroup, Card, Modal } from 'react-bootstrap';
import './Specialities.scss'
import SpecialityForm from './SpecialityForm';
import { useEffect, useState } from 'react';
import { deleteSpeciality, listSpecialites, updateSpeciality } from '@app/api/SpecialityService';
import Speciality from '@app/types/Speciality';
import { Loading } from '@app/components/loading/Loading';

const Specialities = () => {
  const [Specialities, setSpecialities] = useState<Speciality[]>([]);
  const [currentSepciality, setCurrentSpeciality] = useState<Speciality | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [isLoading, setLoading] = useState(true);

  const closeAllModals = () => {
    setCurrentSpeciality(undefined);
    setShowModal(false);
    setShowConfirmModal(false);
  }


  const submitDelete = async (id?: number) => {
    closeAllModals();
    if (!id) {
      return;
    }
    setLoading(true);
    try {
      await deleteSpeciality(id);
      setSpecialities([...Specialities.filter(s => s.id !== id)]);
    } catch (error) {
    }
    setLoading(false);
  }
  const submitSpeciality = async (speciality: Speciality, action: string) => {
    if (action === "new") {
      setSpecialities([...Specialities, speciality]);

    } else if (action === "edit") {
      const newSpecialities = [...Specialities];
      const id = newSpecialities.findIndex(s => s.id === speciality.id);
      newSpecialities[id] = speciality;
      setSpecialities(newSpecialities);
    }
    setCurrentSpeciality(speciality);

  }
  useEffect(() => {
    const fetchData = async () => {
      const data = await listSpecialites();
      return data;
    }
    fetchData().then(Specialities => {
      setSpecialities(Specialities);
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
      {showModal && <SpecialityForm show={showModal} close={closeAllModals} submit={submitSpeciality} currentSpeciality={currentSepciality} />}
      {/* @ts-ignore */}
      {showConfirmModal && (currentSepciality?.id) && <Modal show={showConfirmModal} close={closeAllModals}>
        {/* @ts-ignore */}
        <Modal.Header closeButton>
          <Modal.Title>Delete Speciality</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete speciality <strong>{currentSepciality?.name} </strong>?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeAllModals}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => submitDelete(currentSepciality.id)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      }
      <Card className="card">
        <Card.Header><h3><i className="fas fa-solid fa-briefcase speciality-icon"></i> Specailities</h3></Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-between">
            <p className="m-0 d-flex align-items-center">
              Total specialities:
              <strong className="px-1"> {Specialities?.length || 0} </strong>
            </p>
            <Button variant="info" className="new-btn text-light" title="add new speciality" onClick={() => setShowModal(true)}>New <i className="fas fa-plus"></i></Button>
          </div>
          <table className="table table-bordered table-striped table-responsive-sm">
            <thead>
              <tr>
                <th className="text-center" scope="col">#</th>
                <th className="text-center" scope="col">Name</th>
                <th className="text-center" scope="col">Number Of Procdures</th>
                <th className="text-center" scope="col">Target Types</th>
                <th className="text-center" scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>

              {Specialities.map((speciality, idx) => (
                <tr className="text-center" key={idx}>
                  <th className="text-center" scope="row">{idx + 1}</th>
                  <td className="text-cener">{speciality.name}</td>
                  <td className="text-center">{speciality.proceduresCount || 0}</td>
                  <td className="text-center">
                    <div className="target-types-container">
                      {speciality?.targetTypes.map(type => <Badge className={type.toLowerCase()}>{type}</Badge>)}
                    </div>
                  </td>
                  <td className='text-center'>
                    <ButtonGroup size="sm">
                      <button type="button" title="edit" className="action-btn btn btn-success" onClick={() => { setCurrentSpeciality(speciality); setShowModal(true); }}><i className="fas fa-edit"></i></button>
                      <button type="button" title="delete" className="action-btn btn btn-danger" onClick={() => { setCurrentSpeciality(speciality); setShowConfirmModal(true); }}><i className="far fa-trash-alt"></i></button>
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

export default Specialities;