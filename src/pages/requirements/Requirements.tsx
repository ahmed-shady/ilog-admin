import { Badge, Button, ButtonGroup, Card, Modal, Table } from 'react-bootstrap';
import './Requirements.scss'
import { act, useEffect, useState } from 'react';
import { Loading } from '@app/components/loading/Loading';
import Requirement from '@app/types/Requirement';
import { addRequirement, deleteRequirement, listRequirements, updateRequirement } from '@app/api/RequirementService';
import RequirementForm from './RequirementForm';
import DoctorTypeEnum from '@app/types/DoctorTypeEnum';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import DOCTOR_TYPES_TEXT from '../doctors/util/DoctorTypesText';



const Requirements = () => {
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [currentRequirement, setCurrentRequirement] = useState<Requirement | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setshowConfirmModal] = useState(false);
    const [t] = useTranslation();

    const [isLoading, setLoading] = useState(true);


    
    const closeAllModals = ()=>{
      setCurrentRequirement(null);
      setShowModal(false);
      setshowConfirmModal(false);
    }
    
    const submitDelete = async (id?: number) => {
      closeAllModals();
      setLoading(true);
      try{
        if(id)
          await deleteRequirement(id);
        setRequirements([...requirements.filter(r => r.id !== id)]);
      }finally{
        setLoading(false); 

      }
    }
    const submitRequirement = async (requirement: Requirement, action:string) => {
      if(action === "new"){
        setLoading(true);
        try{
          const newRequirement = await addRequirement(requirement);
          setRequirements([...requirements, newRequirement]);
        }finally{
          setLoading(false);
        }
        
    }else if(action === "edit"){
      setLoading(true);
      try{
        const newRequirement = await updateRequirement(requirement);
        var newRequirements = [...requirements];
        const id = newRequirements.findIndex(r => r.id === newRequirement.id);
        newRequirements[id] = newRequirement;
        setRequirements(newRequirements);
      }finally{
        setLoading(false);
      }
      
    }
  }
    useEffect(() => {
      const fetchData = async () => {
        const data = await listRequirements();
        return data;
      }
      fetchData().then(requirements => {
        setRequirements(requirements);

      }).finally(() => {
        setLoading(false);
      });
    }, []);

    if(isLoading){
      return <Loading/>
    }

    return(
      <>
      {showModal && <RequirementForm show={showModal} close={closeAllModals} submit = {submitRequirement} requirement={currentRequirement}/>}
      {showConfirmModal && currentRequirement != null &&      
      <Modal show={showConfirmModal} close={closeAllModals}>
        {/* @ts-ignore */}
        <Modal.Header closeButton>
          <Modal.Title>Delete Requirement</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete requirement <strong>{currentRequirement?.name} </strong>?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeAllModals}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => submitDelete(currentRequirement.id)}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
      }
      <Card className="my-2 mx-0 m-md-3">
      <Card.Header><h3><i className="fas fa-solid fa-briefcase requirement-icon"></i> Requirements</h3></Card.Header>
      <Card.Body>
      <div className="d-flex justify-content-end">
        <Button variant="info" className="new-btn text-light" title="add new requirement" onClick={()=>setShowModal(true)}>New <i className="fas fa-plus"></i></Button>
</div>
        <table className="table table-bordered table-responsive-sm requirements-table">
        <thead>
          <tr>
            <th className="text-center" scope="col">#</th>
            <th className="text-center" scope="col">Name</th>
            <th className="text-center" scope="col">User Type</th>
            <th className="text-center" scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>

        {requirements.map((requirement,idx) => (
          <>
          <tr   
            data-even={idx % 2 === 0 || undefined}
            data-odd={idx % 2 !== 0 || undefined}
            className="text-center"
            key={idx}
          >
            <th rowSpan={2} className="text-center" scope="row">{idx}</th>
            <td  className="text-cener">{requirement.name}</td>
            <td rowSpan={2}  className="text-center">{DOCTOR_TYPES_TEXT[requirement.doctorType]}</td>
            <td  rowSpan={2} className='text-center'>
                <ButtonGroup size="sm">
                  <button type="button" title="edit" className="action-btn btn btn-success" onClick={()=>{setCurrentRequirement(requirement);setShowModal(true);}}><i className="fas fa-edit"></i></button>
                  <button type="button" title="delete" className="action-btn btn btn-danger" onClick={()=>{setCurrentRequirement(requirement); setshowConfirmModal(true);}}><i className="far fa-trash-alt"></i></button>
                </ButtonGroup>
            </td>
          </tr>
            <tr
            data-even={idx % 2 === 0 || undefined}
            data-odd={idx % 2 !== 0 || undefined}
            className="text-center"
            key={idx+1}
            >
            <td  className="text-cener">{requirement.name}</td>

          </tr>
          </>
        ))
        }
          
        </tbody>
      </table>
      </Card.Body>
    </Card>


</>
    )
}

export default Requirements;