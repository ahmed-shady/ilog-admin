import React from 'react';
import { Formik, Form } from 'formik';
import { Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import IButton from '@app/components/common/IButton';
import IDatePicker from '@app/components/common/date-picker/IDatePicker';
import Speciality from '@app/types/Speciality';
import { Country } from '@app/types/Country';
import { LookupDto } from '@app/types/LookupDto';
import { useTranslation } from 'react-i18next';
import './AdminPostsFilter.scss';
import AdminPostsFilterDto from '@app/types/AdminPostsFilterDto';
import './../../scss/option-selector.scss';

interface AdminPostsFilterProps {
  onFilter: (values: AdminPostsFilterDto) => void;
  onReset: () => void;
  initialValues: AdminPostsFilterDto;
  specialities: Speciality[];
  countries: Country[];
  typeOptions: LookupDto[];
}

const selectStyles = {
  control: (base: any) => ({
    ...base,
    minHeight: '38px',
    borderColor: '#ced4da',
    '&:hover': {
      borderColor: '#667eea'
    }
  }),
  multiValue: (base: any) => ({
    ...base,
    backgroundColor: '#e7f1ff',
    borderRadius: '4px'
  }),
  multiValueLabel: (base: any) => ({
    ...base,
    color: '#667eea',
    fontWeight: 500
  }),
  multiValueRemove: (base: any) => ({
    ...base,
    color: '#667eea',
    '&:hover': {
      backgroundColor: '#667eea',
      color: 'white'
    }
  }),
  indicatorSeparator: (base: any) => ({...base, display:'none'})

};

const AdminPostsFilter: React.FC<AdminPostsFilterProps> = ({ 
  onFilter, 
  onReset, 
  initialValues,
  specialities,
  countries,
  typeOptions
}) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const specialtyOptions = specialities.map(s => ({
    value: s.id!,
    label: s.name
  }));

  const countryOptions = countries.map(c => ({
    value: c.id,
    label: currentLanguage === 'ar' ? c.nameAr : c.name,
    image: c.image
  }));

  const typeOptionsFormatted = typeOptions.map(t => ({
    value: t.key,
    label: currentLanguage === 'ar' ? t.valueAr : t.valueEn
  }));

  return (
    <div className="filter-content">
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={(values) => onFilter(values)}
      >
        {({ values, setFieldValue, resetForm }) => (
          <Form>
            <Row>
              <Col md={6} lg={4} className="mb-3">
                <label className="form-label">Type</label>
                <Select
                  classNamePrefix="select-option"
                  menuPortalTarget={document.body}
                  isMulti
                  name="types"
                  options={typeOptionsFormatted}
                  value={typeOptionsFormatted.filter(opt => values.types?.includes(opt.value))}
                  onChange={(selected) => {
                    setFieldValue('types', selected ? selected.map(s => s.value) : []);
                  }}
                  placeholder="Select types..."
                  styles={selectStyles}
                  isClearable
                />
              </Col>

              <Col md={6} lg={4} className="mb-3">
                <label className="form-label">Specialty</label>
                <Select
                  isMulti
                  classNamePrefix="select-option"
                  menuPortalTarget={document.body}
                  name="specialitiesIds"
                  options={specialtyOptions}
                  value={specialtyOptions.filter(opt => values.specialitiesIds?.includes(opt.value))}
                  onChange={(selected) => {
                    setFieldValue('specialitiesIds', selected ? selected.map(s => s.value) : []);
                  }}
                  placeholder="Select specialties..."
                  styles={selectStyles}
                  isClearable
                />
              </Col>

              <Col md={6} lg={4} className="mb-3">
                <label className="form-label">Country</label>
                <Select
                  isMulti
                  classNamePrefix="select-option"
                  name="countriesIds"
                  menuPortalTarget={document.body}
                  options={countryOptions}
                  value={countryOptions.filter(opt => values.countriesIds?.includes(opt.value))}
                  onChange={(selected) => {
                    setFieldValue('countriesIds', selected ? selected.map(s => s.value) : []);
                  }}
                  placeholder="Select countries..."
                  styles={selectStyles}
                  isClearable
                  formatOptionLabel={(option: any) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img
                        src={option.image}
                        alt={option.label}
                        style={{ width: '20px', height: '15px', objectFit: 'cover' }}
                      />
                      <span>{option.label}</span>
                    </div>
                  )}
                />
              </Col>

              <Col md={6} lg={4} className="mb-3">
                <IDatePicker
                  label="Created Date From"
                  name="createdFromDate"
                  value={values.createdFromDate || ''}
                  onChange={(value) => setFieldValue('createdFromDate', value)}
                  placeholder="Select start date"
                  max={values.createdToDate || undefined}
                />
              </Col>

              <Col md={6} lg={4} className="mb-3">
                <IDatePicker
                  label="Created Date To"
                  name="createdToDate"
                  value={values.createdToDate || ''}
                  onChange={(value) => setFieldValue('createdToDate', value)}
                  placeholder="Select end date"
                  min={values.createdFromDate || undefined}
                />
              </Col>
            </Row>

            <Row>
              <Col className="d-flex justify-content-end gap-2">
                <IButton
                  text="Reset"
                  icon="fas fa-redo"
                  variant="outline-secondary"
                  onClick={() => {
                    resetForm();
                    onReset();
                  }}
                />
                <IButton
                  text="Apply Filters"
                  icon="fas fa-search"
                  variant="primary"
                  type="submit"
                />
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AdminPostsFilter;
