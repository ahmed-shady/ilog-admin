import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';



interface FormCloseConfirmationProps {
  confirm: () => void;
  cancel: () => void;
}


const FormCloseConfirmation: React.FC<FormCloseConfirmationProps> = ({ confirm, cancel }) => {

  return (
    <>
          {/* @ts-ignore */}
        <Modal show={true} close={cancel} size='sm' onHide={cancel} centered>
          {/* @ts-ignore */}
          <Modal.Header closeButton>
            <Modal.Title>Close?</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to <strong>close and discard changes</strong>?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cancel}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirm}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        </>

  );

}


export default React.memo(FormCloseConfirmation);