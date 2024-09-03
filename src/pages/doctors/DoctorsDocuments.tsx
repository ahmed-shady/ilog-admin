import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { Alert, ButtonGroup, Form, InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Requirement from '@app/types/Requirement';
import './Doctors.scss'


import * as Yup from 'yup';
import DoctorTypeEnum from '@app/types/DoctorTypeEnum';
import { changeDocumentVerification, listDocuments } from '@app/api/DocumentService';
import Document from '@app/types/Document';
import { listRequirements } from '@app/api/RequirementService';
import DocumentStatus from '@app/types/DocumentStatus';
import { Loading } from '@app/components/loading/Loading';

const DOCUMENT_STATUS_META: any = {};

DOCUMENT_STATUS_META[DocumentStatus.VERIFIED] = {style:"badge-success", text: "approved"};
DOCUMENT_STATUS_META[DocumentStatus.PENDING] = {style: "badge-warning", text: "pending"};
DOCUMENT_STATUS_META[DocumentStatus.REJECTED] = {style: "badge-danger", text: "rejected"};
DOCUMENT_STATUS_META["NOT_UPLOADED"] = {style: "badge-secondary", text: "not uploaded"};

const DoctorsDocuments = ({show, doctor, close}: any) => {

    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null);
    const [rejecting, setRejecting] = useState(false);
    const [message, setMessage] = useState("");

    const accept = async ()=>{
      if(selectedRequirement?.document){
        setActionLoading(true);
        try{
          await changeDocumentVerification(selectedRequirement.document.id, {status: DocumentStatus.VERIFIED});
          selectedRequirement.document.verification.status=DocumentStatus.VERIFIED;

          setActionLoading(false);
        }catch(error){
          setActionLoading(false);
        }
      }
    }

    const reject = async ()=>{
      if(selectedRequirement?.document){
        setActionLoading(true);
        try{
          await changeDocumentVerification(selectedRequirement.document.id, {status: DocumentStatus.REJECTED, message});
          selectedRequirement.document.verification.status=DocumentStatus.REJECTED;
          cancelRejecting();
          setActionLoading(false);
        }catch(error){
          setActionLoading(false);
        }
      }
    }

    const cancelRejecting = ()=>{
      setRejecting(false);
      setMessage('');
      
    }

    const selectRequirement = (requirement: Requirement)=>{
      if(actionLoading || requirement.id === selectedRequirement?.id)
        return;
      if(requirement?.document){
        setImageLoading(true);
      }
      setSelectedRequirement(requirement);
      cancelRejecting();
    }

    useEffect(() => {
      const fetchData = async () => {
        const documents: Document[] = await listDocuments(doctor.id);
        const requirements = await listRequirements(doctor.type, {success:{toast:false}});
        requirements.forEach(req => {
          req.document = documents.find(doc => doc.requirementId === req.id);
        });
        return requirements;
      }
      fetchData().then(requirements => {
        requirements.sort((r1, r2) => r1.document===r2.document ? 0: (r1.document?-11:1))
        setRequirements(requirements);
        setSelectedRequirement(requirements[0]);
        setLoading(false);

      }).catch((error: any) => {
        setLoading(false);
      
      });
    }, []);


    return (
      

    <Modal show={show && doctor} id="document-modal" onHide={close}
    aria-labelledby="contained-modal-title-vcenter"
    centered>
  {loading? <Loading/>:
  <>
    <Modal.Header className="text-center p-2" closeButton>
      {selectedRequirement &&
        <div className="w-100">
        <strong className="text-lg">{selectedRequirement?.name} of {doctor.name} </strong>
        <span className={`badge ${DOCUMENT_STATUS_META[selectedRequirement?.document?.verification?.status || "NOT_UPLOADED"].style} badge-pill position-relative top-n10`}>
          {DOCUMENT_STATUS_META[selectedRequirement?.document?.verification?.status || "NOT_UPLOADED"].text}
          </span>
        </div>
      }
              

    </Modal.Header>


    <Modal.Body className="overflow-hidden">
      {imageLoading && <Loading/>}
      <img style={{display:(imageLoading?"none":"block")}} src={selectedRequirement?.document?`http://195.35.25.233:8080${selectedRequirement?.document.documentUrl}`:"img/not-found.jpg"}
      className="object-fit-contain"
      onLoad={()=>{setImageLoading(false)}}
      onError={()=>{setImageLoading(false)}}
      />
    </Modal.Body>
    <Modal.Footer className="text-center p-0">
                <div className='action-pane w-100'>
                {rejecting?
                <InputGroup className="mb-3 justify-content-center">
                  <Form.Control
                    className='col-sm-7'
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Reason to reject"
                    value={message}
                    onChange={(e)=>{setMessage(e.target.value)}}
                  />
                  <InputGroup.Append>
                    <button className="btn btn-outline-primary" disabled={actionLoading} onClick={reject}>
                      <i className="fas fa-check border-1" />
                    </button>
                    <button className="btn btn-outline-danger" type="button" disabled={actionLoading} onClick={cancelRejecting}>
                      <i className="fas fa-times border-1" />
                    </button>
                  </InputGroup.Append>
                </InputGroup>
              :
              <ButtonGroup>
                  <Button variant="primary" disabled={actionLoading} onClick={accept}>Accept</Button>
                  <Button variant="danger" disabled={actionLoading} onClick={()=>{setRejecting(true)}}>Reject</Button>
                </ButtonGroup>
              }

                </div>
                <hr className="w-100"/>
                <div className="p-2 m-0 position-relative border-0 w-100 justify-content-center align-items-center d-flex overflow-auto image-pane">
                  {requirements.map((requirement, idx) => 
                    <div key={idx} onClick={() => {selectRequirement(requirement)}}
                    className={`position-relative ${requirement.id===selectedRequirement?.id?"active":""}`}
                    >
                      {(!requirement.document) && <i className="fas fa-question-circle text-secondary fa-2x"/>}
                      {(requirement.document?.verification?.status===DocumentStatus.PENDING) && <i className="fas fa-clock text-warning fa-2x"/>}
                      {(requirement.document?.verification?.status===DocumentStatus.REJECTED) && <i className="fas fa-times-circle text-danger fa-2x"/>}
                      {(requirement.document?.verification?.status===DocumentStatus.VERIFIED) && <i className="fas fa-check-circle text-success fa-2x"/>}

                      <img className='object-fit-contain border rounded'
                          src={requirement.document?`http://195.35.25.233:8080${requirement?.document.documentUrl}`:"img/not-found.jpg"}
                      />
                      </div>
                  )}

                </div>
    </Modal.Footer>  
  </>
}    

      </Modal>


    );

}

export default DoctorsDocuments;