import { useFormik } from 'formik';
import { useMemo } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import * as Yup from 'yup';


const OptionNameEditor = ({ optionName, numberOfOptions, submit, close }: any) => {
  const editing = useMemo(() => !!optionName, [optionName]);
  const initializeForm = () => {
    return useFormik({
      initialValues: {
        optionName: optionName || "",
        numberOfOptions: numberOfOptions
      },
      validationSchema: Yup.object({
        optionName: Yup.string().required('Speciality name is required'),
        numberOfOptions: Yup.number().positive("must be greater than zero")
      }),
      onSubmit: (values) => {
        close();
        submit(values.optionName, values.numberOfOptions);
      },
    });
  }
  const { handleChange, values, handleSubmit, touched, errors, setFieldValue } = initializeForm();


  return (
    <>
      {/* @ts-ignore */}
      <Modal show={true} onHide={close} size='sm'>
        {/* @ts-ignore */}
        <Modal.Header closeButton>
          <Modal.Title>{editing ? 'Edit Option Name' : 'Add Option Name'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} id="option-name-form">
            <div className="mb-3">
              <label>Option name:</label>
              <InputGroup className="mb-3">
                <Form.Control
                  id="optionName"
                  name="optionName"
                  type="text"
                  placeholder="Option Name"
                  onChange={handleChange}

                  value={values.optionName}
                  isValid={touched.optionName && !errors.optionName}
                  isInvalid={touched.optionName && !!errors.optionName}
                />
                {touched.optionName && errors.optionName ? (
                  <Form.Control.Feedback type="invalid">
                    {/* @ts-ignore */}
                    {errors.optionName}
                  </Form.Control.Feedback>
                ) : (
                  <InputGroup.Text>
                    <i className="fas fa-briefcase" />
                  </InputGroup.Text>
                )}
              </InputGroup>
            </div>
            <div className="mb-3">
              <label>Number Of Options:</label>
              <InputGroup className="mb-3">
                <Form.Control
                  id="numberOfOptions"
                  name="numberOfOptions"
                  type="number"
                  placeholder="Number Of Options"
                  onChange={handleChange}
                  disabled={editing}
                  value={values.numberOfOptions}
                  isValid={touched.numberOfOptions && !errors.numberOfOptions}
                  isInvalid={touched.numberOfOptions && !!errors.numberOfOptions}
                />
                {touched.numberOfOptions && errors.numberOfOptions ? (
                  <Form.Control.Feedback type="invalid">
                    {/* @ts-ignore */}
                    {errors.numberOfOptions}
                  </Form.Control.Feedback>
                ) : (
                  <InputGroup.Text>
                    <i className="fas fa-briefcase" />
                  </InputGroup.Text>
                )}
              </InputGroup>
            </div>
          </form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={close}>
            Close
          </Button>
          <Button variant="warning" type="submit" className='text-light' form="option-name-form">
            Apply
          </Button>

        </Modal.Footer>
      </Modal>
    </>

  );

}

export default OptionNameEditor;