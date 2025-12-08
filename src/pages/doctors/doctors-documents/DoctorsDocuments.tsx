import { useEffect, useMemo, useState } from 'react';
import { Badge, ButtonGroup, Form, InputGroup, Alert } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Requirement from '@app/types/Requirement';
import './DoctorsDocuments.scss';

import { changeDocumentVerification, listDocuments } from '@app/api/DocumentService';
import Document from '@app/types/Document';
import { listRequirements } from '@app/api/RequirementService';
import DocumentStatus from '@app/types/DocumentStatus';
import { Loading } from '@app/components/loading/Loading';
import SingleRequirement from './SingleRequirement';

const DOCUMENT_STATUS_META: Record<string, { style: string; text: string; icon: string }> = {
  [DocumentStatus.VERIFIED]: { style: "success", text: "Approved", icon: "fa-check-circle" },
  [DocumentStatus.PENDING]: { style: "warning", text: "Pending Review", icon: "fa-clock" },
  [DocumentStatus.REJECTED]: { style: "danger", text: "Rejected", icon: "fa-times-circle" },
  NOT_UPLOADED: { style: "secondary", text: "Not Uploaded", icon: "fa-upload" }
};

interface DoctorsDocumentsProps {
  show: boolean;
  doctor: any;
  close: () => void;
}

const DoctorsDocuments: React.FC<DoctorsDocumentsProps> = ({ show, doctor, close }) => {

    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [imagesErr, setImagesErr] = useState<boolean[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    const [imageErr, setImageErr] = useState(false);

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
      setImageErr(false);
    }

    useEffect(() => {
      const fetchData = async () => {
        const documents: Document[] = await listDocuments(doctor.id);
        const requirements = await listRequirements(doctor.type, {success:{toast:false}});
        requirements.forEach(req => {
          req.document = documents.find(doc => doc.requirementId === req.id);
          
        });
        setImagesErr(Array(requirements.length).fill(false));
        
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
    }, [doctor]);


    const statusMeta = useMemo(() => {
      const status = selectedRequirement?.document?.verification?.status;
      return DOCUMENT_STATUS_META[status || "NOT_UPLOADED"];
    }, [selectedRequirement]);

    return (
      <Modal 
        show={show && doctor} 
        id="document-modal" 
        onHide={close}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size="lg"
      >
        {loading ? <Loading /> :
          <>
            <Modal.Header closeButton className="border-bottom-0 pb-2">
              {selectedRequirement && (
                <div className="w-100">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h5 className="mb-1">
                        <i className="fas fa-file-alt text-primary me-2"></i>
                        {selectedRequirement?.name}
                      </h5>
                      <p className="text-muted mb-0 small">
                        <i className="fas fa-user-md me-1"></i>
                        {doctor.name}
                      </p>
                    </div>
                    <Badge 
                      pill 
                      bg={statusMeta.style}
                      className="status-badge"
                    >
                      <i className={`fas ${statusMeta.icon} me-1`}></i>
                      {statusMeta.text}
                    </Badge>
                  </div>
                </div>
              )}
            </Modal.Header>

            <Modal.Body className="document-viewer">
              {imageLoading && <Loading />}
              {!imageErr && (
                <img 
                  src={selectedRequirement?.document?.documentUrl || "img/not-found.jpg"}
                  className="document-image"
                  style={{ display: imageLoading ? 'none' : 'block' }}
                  onLoad={() => { setImageLoading(false); setImageErr(false); }}
                  onError={() => { setImageLoading(false); setImageErr(true); }}
                  alt={selectedRequirement?.name}
                />
              )}
              {imageErr && (
                <Alert variant="warning" className="text-center">
                  <i className="fas fa-exclamation-triangle fa-2x mb-3"></i>
                  <p className="mb-2">Unable to display document preview</p>
                  <a 
                    download 
                    target='_blank' 
                    href={selectedRequirement?.document?.documentUrl}
                    className="btn btn-sm btn-outline-primary"
                    rel="noreferrer"
                  >
                    <i className="fas fa-download me-2"></i>
                    Download Document
                  </a>
                </Alert>
              )}
            </Modal.Body>
            <Modal.Footer className="document-footer">
              {/* Action Buttons */}
              <div className='action-pane w-100'>
                {rejecting ? (
                  <div className="rejection-form">
                    <Alert variant="info" className="mb-3">
                      <i className="fas fa-info-circle me-2"></i>
                      Please provide a reason for rejecting this document
                    </Alert>
                    <InputGroup className="mb-3">
                      <InputGroup.Text>
                        <i className="fas fa-comment-alt"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Enter rejection reason..."
                        value={message}
                        onChange={(e) => { setMessage(e.target.value) }}
                        disabled={actionLoading}
                      />
                      <Button 
                        variant="success" 
                        disabled={actionLoading || !message.trim()} 
                        onClick={reject}
                      >
                        <i className="fas fa-check me-1" />
                        <span className="d-none d-md-inline">Confirm</span>
                      </Button>
                      <Button 
                        variant="secondary" 
                        disabled={actionLoading} 
                        onClick={cancelRejecting}
                      >
                        <i className="fas fa-times me-1" />
                        <span className="d-none d-md-inline">Cancel</span>
                      </Button>
                    </InputGroup>
                  </div>
                ) : (
                  <div className="action-buttons">
                    <Button 
                      variant="success" 
                      disabled={actionLoading || !selectedRequirement?.document} 
                      onClick={accept}
                      className="action-btn"
                    >
                      <i className="fas fa-check-circle me-2" />
                      Approve Document
                      {actionLoading && <span className="spinner-border spinner-border-sm ms-2"></span>}
                    </Button>
                    <Button 
                      variant="danger" 
                      disabled={actionLoading || !selectedRequirement?.document} 
                      onClick={() => { setRejecting(true) }}
                      className="action-btn"
                    >
                      <i className="fas fa-times-circle me-2" />
                      Reject Document
                    </Button>
                  </div>
                )}
              </div>

              {/* Document Thumbnails */}
              <div className="documents-gallery">
                <div className="gallery-label">
                  <i className="fas fa-folder-open me-2"></i>
                  All Documents ({requirements.length})
                </div>
                <div className="image-pane">
                  {requirements.map((requirement, idx) => 
                    <SingleRequirement 
                      key={idx} 
                      requirement={requirement} 
                      selected={requirement.id === selectedRequirement?.id} 
                      selectRequirement={selectRequirement}
                    />
                  )}
                </div>
              </div>
            </Modal.Footer>  
  </>
}    

      </Modal>


    );

}

export default DoctorsDocuments;