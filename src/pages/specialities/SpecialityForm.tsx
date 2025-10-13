import { addSpeciality, getSpeciality, updateSpeciality } from '@app/api/SpecialityService';
import ProcedureOption from '@app/types/ProcedureOption';
import React, { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Form, InputGroup, Spinner } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import Option from './Option';
import { generateRandom } from '@app/utils/RanomGenerator';
import Speciality from '@app/types/Speciality';
import { Loading } from '@app/components/loading/Loading';
import Select from 'react-select';
import TargetTypesSelectStyle from './TargetTypesSelectStyle';
import { ActivityType, ActivityTypeText } from '@app/types/ActivityType';
import FormCloseConfirmation from './FormCloseConfirmation';


interface FormProps {
  show: boolean;
  currentSpeciality?: Speciality;
  submit: any;
  close: any

}

const targetTypesOptions = Object.values(ActivityType)
  .map(type => ({ label: ActivityTypeText[type], value: type }));


const SpecialityForm: React.FC<FormProps> = ({ show, currentSpeciality, submit, close }) => {

  // const [showAlert, setShowAlert] = useState(false);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState<string>(
    currentSpeciality?.name || ""
  );

  const [targetTypes, setTargetTypes] = useState<ActivityType[]>(
    currentSpeciality?.targetTypes || Object.values(ActivityType)
  );

  const [procedures, setProcedures] = useState<ProcedureOption[]>(
    (currentSpeciality?.procedures) ? JSON.parse(JSON.stringify(currentSpeciality.procedures)) : []
  );
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [hasError, setHasError] = useState(false);

  const [dirty, setDirty] = useState(false);

  const [showFormCloseConfirmModal, setShowFormCloseConfirmModal] = useState(false);

  const targetTypeSelectorStyle = useMemo(() => TargetTypesSelectStyle(!targetTypes.length), [targetTypes]);

  const discardClose = () => setShowFormCloseConfirmModal(false);
  const promptClose = () => {
    if (dirty)
      setShowFormCloseConfirmModal(true);
    else
      close();
  }

  useEffect(() => {
    initializeOptions(procedures);
  }, [procedures]);


  const changeName = useCallback((newName: string) => {
    setName(newName);
    setDirty(true);

  }, [setName, setDirty]);

    const changeTargetTypes = useCallback((newTargetTypes: ActivityType[]) => {
    setTargetTypes(newTargetTypes);
    setDirty(true);

  }, [setTargetTypes, setDirty]);


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
    var obj = { ...(currentSpeciality || {}), name, procedures, targetTypes };
    setSubmitting(true);
    setLoading(true);
    try {
      const saved = (currentSpeciality?.id) ?
        await updateSpeciality(currentSpeciality.id, obj) :
        await addSpeciality(obj);

      let action = (currentSpeciality?.id) ? "edit" : "new"
      submit(saved, action);
      setName(saved.name);
      setProcedures(saved?.procedures || []);
      setDirty(false);
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  // Sync error state
  useEffect(() => {
    const childError = Object.values(errors).some(Boolean);
    const currentHasError = childError || !name || (!(targetTypes?.length));
    setHasError(currentHasError);
  }, [errors, name, targetTypes]);

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
      setDirty(true);
    }, [setProcedures]);

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

  const formTitle = useMemo(() =>
    currentSpeciality ?
      <>
        Edit Speciality <strong>{currentSpeciality.name}</strong>
      </>
      :<>Add new Speciality</>
    ,[currentSpeciality]);

  return (
    <>
      {showFormCloseConfirmModal && <FormCloseConfirmation cancel={discardClose} confirm={close}/>}
      {/* @ts-ignore */}
      <Modal show={show} onHide={promptClose}>
        {/* @ts-ignore */}
        <Modal.Header closeButton>
          <Modal.Title>{formTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            loading &&
            <Loading customMessage={submitting ? 'Saving' : undefined} transparent
            />
          }
          <form onSubmit={submitForm} id="speciality-form">
            <div>
              <label>Name:</label>
              <InputGroup className="mb-3">
                <Form.Control
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Speciality name"
                  onChange={(e) => changeName(e.target.value)}
                  value={name}
                  isInvalid={!name}
                />
                <InputGroup.Append>
                  <InputGroup.Text>
                    <i className="fas fa-briefcase" />
                  </InputGroup.Text>
                </InputGroup.Append>
                <Form.Control.Feedback type="invalid">
                  Name is required
                </Form.Control.Feedback>
              </InputGroup>
              <label>Target Types:</label>
              <InputGroup className="mb-3">
                <div className='d-flex w-100'>
                  <Select
                    value={targetTypesOptions.filter(opt => targetTypes.includes(opt.value))}
                    className='w-100'
                    styles={targetTypeSelectorStyle}
                    placeholder='Targt Types'
                    isMulti
                    options={targetTypesOptions}
                    //menuPortalTarget={document.body}
                    formatOptionLabel={(option) => (
                      <div className="state-option">
                        <span style={{ padding: "1px" }}>{option.label}</span>
                      </div>
                    )}
                    onChange={(selectedOptions) => changeTargetTypes(selectedOptions.map(op => op.value))}
                    getOptionValue={(option) => option.value}
                  />

                  <InputGroup.Append>
                    <InputGroup.Text>
                      <i className="fas fa-bars" />
                    </InputGroup.Text>
                  </InputGroup.Append>
                </div>
                {!(targetTypes.length) && (
                  <Form.Control.Feedback type="invalid" className='d-block'>
                    At least one target type
                  </Form.Control.Feedback>
                )}
              </InputGroup>
              <br />
              <label>Surgical Procedures:</label>
              <div className='row procedures'>
                {procedures?.map((activity: ProcedureOption, idx: number) =>
                  <Option
                    onError={handleError}
                    key={`${idx}`}
                    onDelete={deleteProcedure} activity={activity} padding={30}
                    setDirty={setDirty}
                  />
                )
                }
              </div>
            </div>

          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={promptClose}>Close</Button>
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