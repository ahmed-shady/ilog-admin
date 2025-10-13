import ProcedureOption from "@app/types/ProcedureOption";
import React, { useCallback, useEffect, useState } from "react";
import { Button, ButtonGroup, Collapse, Dropdown, DropdownButton, Form, InputGroup } from "react-bootstrap";
import OptionNameEditor from "./OptionNameEditor";
import { generateRandom } from "@app/utils/RanomGenerator";

const levelColors: string[] = ["red", "green", "blue"];

interface OptionProps {
  activity: ProcedureOption;
  padding: number;
  level?: number;
  onDelete: (id: string) => void;
  onError: (id: string, hasError: boolean) => void;
  onChange?: (id: string, updated: ProcedureOption) => void; // <-- parent-driven state
  setDirty: (value: boolean) => void;
}

const Option: React.FC<OptionProps> = ({
  activity,
  padding,
  level = 1,
  onDelete,
  onError,
  onChange,
  setDirty
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(activity?.value ?? "");
  const [optionName, setOptionName] = useState(activity?.optionName);
  const [options, setOptions] = useState<ProcedureOption[]>(activity?.options || []);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [hasError, setHasError] = useState(false);
  const [editingOptionName, setEditingOptionName] = useState(false);

    const [loaded, setLoaded] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
    if(!open && !loaded){
        setLoaded(true);
    }
};
  

  // Ensure identifier
  useEffect(() => {

    setValue(activity?.value ?? "");
    setOptionName(activity?.optionName);
    setOptions(activity?.options || []);
  }, [activity]);

useEffect(() => {

  setErrors(prev => {
    const validIds = new Set(options.map(o => o.identifier));
    const cleaned: Record<string, boolean> = {};
    for (const [id, val] of Object.entries(prev)) {
      if (validIds.has(id)) cleaned[id] = val;
    }
    return cleaned;
  });
}, [options]);

  // Sync error state
  useEffect(() => {
    const childError = Object.values(errors).some(Boolean);
    const currentHasError = childError || !value;
    const oldHasError = hasError;
    setHasError(currentHasError);
    if(oldHasError !== currentHasError){
        onError(activity.identifier, currentHasError);
    }
  }, [errors, value, activity.identifier, onError]);

  // Child error handler
  const handleError = useCallback((id: string, value: boolean) => {
    setErrors((prev) => ({ ...prev, [id]: value }));
  }, []);

// Add sub-option
const addSubOption = useCallback((numberOfSubOptions = 1) => {
  setOptions((prevOptions) => {
    let addedOptions: ProcedureOption[] = [];
    for(let i=0; i < numberOfSubOptions; i++){
        addedOptions.push({ identifier: generateRandom(), value: "" });
    }
    const newOptions = [...prevOptions, ...addedOptions];

    setOpen(true);
    setLoaded(true);
    activity.options = newOptions;


    return newOptions;
  });
}, [activity.identifier, onChange]);


// Delete sub-option
const deleteSubOption = useCallback(
  (id: string) => {
    setOptions((prevOptions) => {
      const newOptions = prevOptions.filter((o) => o.identifier !== id);

      if (!newOptions.length) setOptionName(undefined);

      activity.options = newOptions;
      setDirty(true);
      return newOptions;
    });
  },
  [activity.identifier, onChange]
);

const submitOptionName = useCallback((newOptionName: string, numberOfOptions: number) => {
    setOptionName(newOptionName);
    activity.optionName = newOptionName;
    const toBeAdded = numberOfOptions - (options?.length || 0);
    addSubOption(toBeAdded);

}, [setOptionName, addSubOption, activity, options]);

const closeEditingOptionName = useCallback(() => setEditingOptionName(false), [setEditingOptionName]);
  return (
    <>
    {editingOptionName && <OptionNameEditor 
                            optionName={optionName}
                            numberOfOptions={options?.length || 1}
                            close={closeEditingOptionName}
                            submit={submitOptionName}                            
                            />
                        
    }
    <div className="mb-3 w-100">
      <InputGroup className="mb-1">
        {optionName && (
          <Button
            variant="secondary"
            style={{ borderRadius: "0"}}
            onClick={handleToggle}
            className={`option-collapse-control ${open? "open": ""}`}
            aria-controls="example-collapse"
            aria-expanded={open}
          >
            <img src="/img/right-arrow-head.svg" style={{ width: "7px" }} />
          </Button>
        )}

        <Form.Control
          value={value}
          isInvalid={hasError}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            setValue(newValue);
            setDirty(true);
            activity.value = newValue;
            onChange?.(activity.identifier, { ...activity, value: newValue });
          }}
        />
        <Button
            size="sm"
            variant="secondary"
            style={{ borderRadius: "0"}}
            onClick={() => {optionName? addSubOption(1): setEditingOptionName(true);}}
          >
            <i className="fa fa-plus"></i>

          </Button>

          <DropdownButton
            drop="left"
            title={<i className="fas fa-cog" />}
            size="sm"
            style={{ borderRadius: "0"}}
            as={ButtonGroup}
            id={"bg-nested-dropdown" + activity.identifier}
            className="no-caret action-dropdown"
          >

              <Dropdown.Item eventKey="1" className="dropdown-item m-0" onClick={() => setEditingOptionName(true)}>
                {optionName? 'Edit Option Name': 'Add Option'}
              </Dropdown.Item>


            <Dropdown.Item eventKey="3" className="dropdown-item m-0" onClick={() => onDelete(activity.identifier)}>
              Delete
            </Dropdown.Item>
          </DropdownButton>
      </InputGroup>

      {optionName && (
        <Collapse in={open}>
          <div>
            <div style={{ color: levelColors[level - 1] || "black" }}>{optionName}</div>
            <div
              style={{
                paddingLeft: `${padding}px`,
                borderLeftColor: levelColors[level - 1] || "black",
                borderLeftStyle: "dashed",
                borderLeftWidth: "1px",
              }}
            >
              {loaded && options.map((o) => (
                <Option
                  key={o.identifier}
                  activity={o}
                  padding={padding + 30}
                  level={level + 1}
                  onDelete={deleteSubOption}
                  onError={handleError}
                  onChange={onChange}
                  setDirty={setDirty}
                />
              ))}
            </div>
          </div>
        </Collapse>
      )}
    </div>
    </>
  );
};

export default React.memo(Option);