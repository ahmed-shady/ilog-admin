import { Badge, Button, ButtonGroup, Card, Form, FormLabel, InputGroup, Modal, Table } from 'react-bootstrap';
import './Specialities.scss'
import SpecialityForm from './SpecialityForm';
import { act, useEffect, useState } from 'react';
import { addSpeciality, deleteSpeciality, listSpecialites, updateSpeciality } from '@app/api/SpecialityService';
import Speciality from '@app/types/Speciality';
import { Loading } from '@app/components/loading/Loading';

const Specialities = () => {
    const [Specialities, setSpecialities] = useState<Speciality[]>([]);
    const [currentSepciality, setCurrentSpeciality] = useState<Speciality | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setshowConfirmModal] = useState(false);

    const [isLoading, setLoading] = useState(true);

    const closeAllModals = ()=>{
      setCurrentSpeciality(null);
      setShowModal(false);
      setshowConfirmModal(false);
    }
    
    const submitDelete = async (id: number) => {
      closeAllModals();
      setLoading(true);
      try{
        await deleteSpeciality(id);
        setSpecialities([...Specialities.filter(s => s.id !== id)]);
      }catch(error){
      }
      setLoading(false); 
    }
    const submitSpeciality = async (speciality: Speciality, action:string) => {
      if(action === "new"){
        setLoading(true);
        try{
          const newSpeciality = await addSpeciality(speciality.name, speciality.proceduralActivities);
          setSpecialities([...Specialities, newSpeciality]);
        }catch(error){
        }
        setLoading(false);
    }else if(action === "edit"){
      setLoading(true);
      try{
        const newSpeciality = await updateSpeciality(speciality.id, speciality.name, speciality.proceduralActivities);
        var newSpecialities = [...Specialities];
        const id = newSpecialities.findIndex(s => s.id === newSpeciality.id);
        newSpecialities[id] = newSpeciality;
        setSpecialities(newSpecialities);
      }catch(error){
      }
      setLoading(false);
    }
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

    if(isLoading){
      return <Loading/>
    }

    return(
      <>
      {showModal && <SpecialityForm show={showModal} close={closeAllModals} submit = {submitSpeciality} speciality={currentSepciality}/>}
      {showConfirmModal && currentSepciality != null &&      
      <Modal show={showConfirmModal} close={closeAllModals}>
        {/* @ts-ignore */}
        <Modal.Header closeButton>
          <Modal.Title>Delete Speciality</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete speciality <strong>{currentSepciality?.name} </strong>?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeAllModals}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => submitDelete(currentSepciality.id)}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
      }
      <Card className="card">
      <Card.Header><h3><i className="fas fa-solid fa-briefcase speciality-icon"></i> Specailities</h3></Card.Header>
      <Card.Body>
      <div className="d-flex justify-content-end">
        <Button variant="info" className="new-btn text-light" title="add new speciality" onClick={()=>setShowModal(true)}>New <i className="fas fa-plus"></i></Button>
</div>
        <table className="table table-bordered table-striped table-responsive-sm">
        <thead>
          <tr>
            <th className="text-center" scope="col">#</th>
            <th className="text-center" scope="col">Name</th>
          <th className="text-center" scope="col">Surgical Procedures</th>
            <th className="text-center" scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>

        {Specialities.map((speciality,idx) => (
          <tr className="text-center" key={idx}>
            <th className="text-center" scope="row">{idx}</th>
            <td className="text-cener">{speciality.name}</td>
            <td className="text-center">{speciality.proceduralActivities?.length || 0}</td>
            <td className='text-center'>
                <ButtonGroup size="sm">
                  <button type="button" title="edit" className="action-btn btn btn-success" onClick={()=>{setCurrentSpeciality(speciality);setShowModal(true);}}><i className="fas fa-edit"></i></button>
                  <button type="button" title="delete" className="action-btn btn btn-danger" onClick={()=>{setCurrentSpeciality(speciality); setshowConfirmModal(true);}}><i className="far fa-trash-alt"></i></button>
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