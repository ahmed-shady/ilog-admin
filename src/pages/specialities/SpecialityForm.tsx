import Speciality from '@app/types/Speciality';
import { useFormik } from 'formik';
import { useState } from 'react';
import { Alert, Form, InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import * as Yup from 'yup';


const SpecialityForm = ({show, speciality, submit, close}: any) => {
    const [showAlert, setShowAlert] = useState(false);

    const x = () => {
      return useFormik({
        initialValues: {
          name: speciality?.name || '',
        },
        validationSchema: Yup.object({
          name: Yup.string().required('Speciality name is required'),
        }),
        onSubmit: (values) => {
          close();
          if(speciality)
            submit({...speciality, name: values.name}, "edit");
        else
          submit({name: values.name}, "new")
        },
      });
    }
    const { handleChange, values, handleSubmit, touched, errors } = x();
  
    return (
      <>
        <Modal show={show} onHide={close}>
          {/* @ts-ignore */}
          <Modal.Header closeButton>
            <Modal.Title>{speciality? 'Edit Speciality': 'Add new Speciality'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <form onSubmit={handleSubmit} id="speciality-form">
            <div className="mb-3">
              <InputGroup className="mb-3">
                <Form.Control
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Speciality name"
                  onChange={(e) => {
                    handleChange(e);
                    if(speciality && speciality.name != e.target.value && speciality.doctorsCount)
                      setShowAlert(true);
                    else
                      setShowAlert(false);
                  }}
                  
                  value={values.name}
                  isValid={touched.name && !errors.name}
                  isInvalid={touched.name && !!errors.name}
                />
                {touched.name && errors.name ? (
                  <Form.Control.Feedback type="invalid">
                    {/* @ts-ignore */}
                    {errors.name}
                  </Form.Control.Feedback>
                ) : (
                  <InputGroup.Append>
                    <InputGroup.Text>
                      <i className="fas fa-briefcase" />
                    </InputGroup.Text>
                  </InputGroup.Append>
                )}
              </InputGroup>
            </div>

          </form>
            <Alert variant="warning" dismissible show={showAlert} onClose={() => setShowAlert(false)}>
            This will affect all {speciality?.doctorsCount} doctors assigned to it
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={close}>
              Close
            </Button>
            <Button variant="info" type="submit" form="speciality-form">
              Save Changes
            </Button>
      
          </Modal.Footer>
        </Modal>
        </>

    );

}

export default SpecialityForm;