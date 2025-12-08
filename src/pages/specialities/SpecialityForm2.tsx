import { addSpeciality, getSpeciality, updateSpeciality } from '@app/api/SpecialityService';
import ProcedureOption from '@app/types/ProcedureOption';
import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { Form, InputGroup, Spinner } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import Option from './Option';
import { generateRandom } from '@app/utils/RanomGenerator';
import Speciality from '@app/types/Speciality';
import { Loading } from '@app/components/loading/Loading';


interface FormProps {
  show: boolean;
  currentSpeciality?: Speciality;
  submit: any;
  close: any

}

const SpecialityForm: React.FC<FormProps> = ({ show, currentSpeciality, submit, close }) => {

  // const [showAlert, setShowAlert] = useState(false);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState<string>(
    currentSpeciality?.name || ""
  );
  const [procedures, setProcedures] = useState<ProcedureOption[]>(
    (currentSpeciality?.procedures)? JSON.parse(JSON.stringify(currentSpeciality.procedures)) : []
  );
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    initializeOptions(procedures);
  }, [procedures]);

  const initializeOptions = (mock?: ProcedureOption[]) => {
    mock?.forEach(p => {
      if (!p.identifier) {
        p.identifier = generateRandom();
      }
      if (p.options?.length) {
        initializeOptions(p.options);
      }
    })
  }

  const submitForm = async (e: FormEvent) => {
      e.preventDefault();
        var obj = {...(currentSpeciality || {}), name, procedures};
        setSubmitting(true);
        setLoading(true);
        try{
          const saved = (currentSpeciality?.id)? 
          await updateSpeciality(currentSpeciality.id, obj):
          await addSpeciality(obj);

          let action = (currentSpeciality?.id)? "edit": "new"
          submit(saved, action);
          setName(saved.name);
          setProcedures(saved?.procedures || [])
        }finally{
          setSubmitting(false);
          setLoading(false);
        }
  };

    // Sync error state
    useEffect(() => {
      const childError = Object.values(errors).some(Boolean);
      const currentHasError = childError || !name;
      setHasError(currentHasError);
    }, [errors, name]);
  
    // Child error handler
    const handleError = useCallback((identifier: string, value: boolean) => {
      setErrors((prev) => ({ ...prev, [identifier]: value }));
    }, []);
    
    // Delete sub-option
    const deleteProcedure = useCallback(
      (identifier: string) => {
        setProcedures(
          (prevProcedures) => prevProcedures.filter((p) => p.identifier !== identifier)
        );
    },[setProcedures]);

  // Fetch procedures if editing
  useEffect(() => {
    const loadSpecialityDetials = async () => {
      if (currentSpeciality?.id) {
        setLoading(true);
        try {
          const specialityDetails = await getSpeciality(currentSpeciality.id);
          setProcedures(specialityDetails?.procedures || []);
          setName(specialityDetails.name);
        } catch (err) {
          console.error('Failed to load procedures', err);
        } finally {
          setLoading(false);
        }
      }
    };
    loadSpecialityDetials();
  }, [currentSpeciality]);


  const addProcedure = () => {
    setProcedures([...procedures, { identifier: generateRandom(), value: "" }]);
  }

  return (
    <>
      {/* @ts-ignore */}
      <Modal show={show} onHide={close}>
        {/* @ts-ignore */}
        <Modal.Header closeButton>
          <Modal.Title>{currentSpeciality ? 'Edit Speciality' : 'Add new Speciality'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
                loading && 
                <Loading customMessage={submitting? 'Saving': undefined} transparent
                />
                }
          <form onSubmit={submitForm} id="speciality-form">
            <div className="mb-3">
              <label>Name:</label>
              <InputGroup className="mb-3">
                <Form.Control
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Speciality name"
                  onChange={(e) => setName(e.target.value)}

                  value={name}
                  isInvalid={!name}
                />
                {!name ? (
                  <Form.Control.Feedback type="invalid">
                    Name is required
                  </Form.Control.Feedback>
                ) : (
                  <InputGroup.Text>
                    <i className="fas fa-briefcase" />
                  </InputGroup.Text>
                )}
              </InputGroup>
              <label>Surgical Procedures:</label>
              <div className='row procedures'>
                {procedures?.map((activity: ProcedureOption, idx: number) =>
                    <Option
                      onError={handleError}
                      key={`${idx}`}
                      onDelete={deleteProcedure} activity={activity} padding={30}
                    />
                  )
                }
              </div>
            </div>

          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={close}>Close</Button>
          <Button disabled={loading} variant='warning' className='text-light' onClick={addProcedure}>Add Procedure</Button>
          <Button disabled={loading || hasError} variant="info" type="submit" className='text-light' form="speciality-form">
            Save Changes
          </Button>

        </Modal.Footer>
      </Modal>
    </>

  );

}


export default SpecialityForm;