import { useFormik } from 'formik';
import { Form, InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './Requirements.scss'


import * as Yup from 'yup';
import DoctorTypeEnum from '@app/types/DoctorTypeEnum';
import { useTranslation } from 'react-i18next';

const RequirementForm = ({show, requirement, submit, close}: any) => {

    const [t] = useTranslation();

    const initForm = () => {
      return useFormik({
        initialValues: {
          name: requirement?.name || '',
          doctorType: requirement?.doctorType || DoctorTypeEnum.TRAINEE,
          optional: requirement?.optional || false
        },
        validationSchema: Yup.object({
          name: Yup.string().required('Requirement name is required'),
          doctorType: Yup.mixed<DoctorTypeEnum>().oneOf(Object.values(DoctorTypeEnum), "Choose a valid option")
        }),
        onSubmit: (values) => {
          close();
          if(requirement)
            submit({...requirement, ...values}, "edit");
        else
          submit({...values}, "new")
        }
      });
    }
    const { handleChange, values, handleSubmit, touched, errors } = initForm();
  
    return (
      <>
        {/* @ts-ignore */}
        <Modal show={show} onHide={close}>
          {/* @ts-ignore */}
          <Modal.Header closeButton>
            <Modal.Title>{requirement? 'Edit Requirement': 'Add new Requirement'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <form onSubmit={handleSubmit} id="requirement-form">
              <InputGroup className="mb-3">
                <Form.Label className='col-sm-2'>Name</Form.Label>
                <InputGroup className='col-sm-10'>
                  <Form.Control
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Requirement name"
                    onChange={handleChange}
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
                    <InputGroup.Text>
                      <i className="fas fa-info-circle" />
                    </InputGroup.Text>
                  )}
                </InputGroup>
              </InputGroup>
              <InputGroup className="mb-3">
              <Form.Label className='col-sm-2 align-center'>For</Form.Label>
              <InputGroup className='col-sm-10'>
              <select
                id="doctorType"
                name="doctorType"
                className="form-control"
                onChange={handleChange}
                value={values.doctorType}
              >
                  {Object.values(DoctorTypeEnum).map(
                    type => <option value={type}>{t(`doctors.types.${type.toLowerCase()}`)}</option>
                  )}
                </select>
                {touched.doctorType && errors.doctorType ? (
                  <Form.Control.Feedback type="invalid">
                    {/* @ts-ignore */}
                    {errors.doctorType}
                  </Form.Control.Feedback>
                ) : (
                  <InputGroup.Text>
                    <i className="fas fa-user-md" />
                  </InputGroup.Text>
                )}
                </InputGroup>
              </InputGroup>

              <InputGroup className="mb-3">
                <Form.Label className='col-sm-2 align-center'>Optional</Form.Label>
                <InputGroup className='col-sm-10'>
                  <Form.Check 
                  aria-label="optional"                 
                  id="optional"
                  name="optional"
                  className="checkbox-primary" 
                  checked={values.optional} 
                  onChange={handleChange}
                  />
                </InputGroup>
              </InputGroup>
          </form>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={close}>
              Close
            </Button>
            <Button variant="info" type="submit" className='text-light' form="requirement-form">
              Save Changes
            </Button>
      
          </Modal.Footer>
        </Modal>
        </>

    );

}

export default RequirementForm;