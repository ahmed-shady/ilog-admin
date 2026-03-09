import React from 'react';
import './IDatePicker.scss';

interface IDatePickerProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const IDatePicker: React.FC<IDatePickerProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  min,
  max,
  disabled = false,
  required = false,
  className = ''
}) => {
  return (
    <div className={`idate-picker ${className}`}>
      <label className="form-label" htmlFor={name}>
        {label}
        {required && <span className="required-indicator">*</span>}
      </label>
      <div className="idate-picker-input-wrapper">
        <i className="fas fa-calendar-alt idate-picker-icon"></i>
        <input
          type="date"
          id={name}
          name={name}
          className="form-control idate-picker-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          disabled={disabled}
          required={required}
        />
      </div>
    </div>
  );
};

export default IDatePicker;
