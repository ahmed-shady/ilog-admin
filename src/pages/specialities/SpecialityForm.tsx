import { useFormik } from 'formik';
import { Alert, Form, InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import * as Yup from 'yup';


const SpecialityForm = ({ show, speciality, submit, close }: any) => {
  // const [showAlert, setShowAlert] = useState(false);

  const initializeForm = () => {
    return useFormik({
      initialValues: {
        name: speciality?.name || '',
        proceduralActivities: speciality?.proceduralActivities || []
      },
      validationSchema: Yup.object({
        name: Yup.string().required('Speciality name is required'),
        proceduralActivities: Yup.array()
        .of(
          Yup.string().required("Can't be empty")  // Validation for each array element
        )
        .required('Must have items') // Ensure array itself is present
        .min(1, 'At least one item is required')  // Custom array validations
      }),
      onSubmit: (values) => {
        const newSpeciality = {name: values.name, proceduralActivities: values.proceduralActivities};
        close();
        if (speciality)
          submit({ ...speciality, ...newSpeciality }, "edit");
        else
          submit(newSpeciality, "new")
      },
    });
  }
  const { handleChange, values, handleSubmit, touched, errors, setFieldValue } = initializeForm();

  const addProceduralActivity = () => {
    setFieldValue("proceduralActivities", [...values.proceduralActivities, ""])

  }
  const changeProceduralActivity =(idx: number, value: string) => {
    values.proceduralActivities[idx] = value;
    setFieldValue("proceduralActivities", [...values.proceduralActivities])

  }

  const removeActivity = (idx: number) => {
    values.proceduralActivities.splice(idx, 1);
    setFieldValue("proceduralActivities", [...values.proceduralActivities]);   
  }
  return (
    <>
      {/* @ts-ignore */}
      <Modal show={show} onHide={close}>
        {/* @ts-ignore */}
        <Modal.Header closeButton>
          <Modal.Title>{speciality ? 'Edit Speciality' : 'Add new Speciality'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} id="speciality-form">
            <div className="mb-3">
            <label>Name:</label>
              <InputGroup className="mb-3">
                <Form.Control
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Speciality name"
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
                  <InputGroup.Append>
                    <InputGroup.Text>
                      <i className="fas fa-briefcase" />
                    </InputGroup.Text>
                  </InputGroup.Append>
                )}
              </InputGroup>
              {values.proceduralActivities?.length > 0 && <label>Surgical Procedures:</label>}
              <div className='row procedures'>
                {values.proceduralActivities.map((activity: string, idx: number) =>
                  <InputGroup key={idx} className="col-12 mb-3">
                    <Form.Control value={activity}
                      onChange={(e) => {
                        changeProceduralActivity(idx, e.target.value);
                      }}
                      /*@ts-ignore */
                      isInvalid={touched.proceduralActivities && touched.proceduralActivities[idx] && errors.proceduralActivities && !!errors.proceduralActivities[idx]}
                    />
                    <InputGroup.Append
                      className={"remove-activity " }
                      onClick={() => removeActivity(idx)}
                    >
                      <InputGroup.Text>
                        <i className="fas fa-trash" />
                      </InputGroup.Text>
                    </InputGroup.Append>
                  </InputGroup>
                )}
              </div>
            </div>

          </form>
          <Alert variant="danger" className='border-0 font-weight-bold text-light' show={!!errors.proceduralActivities && !!touched.proceduralActivities}>
            Surgical Procedure can't be empty
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='warning' className='text-light' onClick={addProceduralActivity}>Add Procedure</Button>
          <Button variant="secondary" onClick={close}>
            Close
          </Button>
          <Button variant="info" type="submit" className='text-light' form="speciality-form">
            Save Changes
          </Button>

        </Modal.Footer>
      </Modal>
    </>

  );

}

export default SpecialityForm;