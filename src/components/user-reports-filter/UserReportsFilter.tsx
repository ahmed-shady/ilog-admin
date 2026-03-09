import React from 'react';
import { Formik, Form } from 'formik';
import { Col, Row } from 'react-bootstrap';
import Select from 'react-select';
import { UserReportStatus } from '@app/types/UserReportDto';
import IButton from '@app/components/common/IButton';
import UserSelector from '@app/components/user-selector/UserSelector';
import IDatePicker from '@app/components/common/date-picker/IDatePicker';
import './UserReportsFilter.scss';
import { UserReportFilterDto } from '@app/types/UserReportFilterDto';


interface UserReportsFilterProps {
  onFilter: (values: UserReportFilterDto) => void;
  onReset: () => void;
  initialValues: UserReportFilterDto;
  // Options for dropdowns (will be populated with actual data)
  reasonOptions: Array<{ value: string; label: string }>;
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
  })
};

const UserReportsFilter: React.FC<UserReportsFilterProps> = ({
  onFilter,
  onReset,
  initialValues,
  reasonOptions
}) => {
  const statusOptions = [
    { value: UserReportStatus.PENDING, label: 'Pending' },
    { value: UserReportStatus.FALSE_REPORT, label: 'False Report' },
    { value: UserReportStatus.ACTION_TAKEN, label: 'Action Taken' }
  ];

  return (
    <div className="filter-content">
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={(values) => {
          onFilter(values);
        }}
      >
        {({ values, setFieldValue, resetForm }) => (
          <Form>
            <Row>
              <Col md={6} lg={4} className="mb-3">
                <UserSelector
                  label="Reporter"
                  name="reporterIds"
                  value={values.reporterIds || []}
                  onChange={(selectedIds) => setFieldValue('reporterIds', selectedIds)}
                  placeholder="Type to search reporters..."
                />
              </Col>

              <Col md={6} lg={4} className="mb-3">
                <UserSelector
                  label="Reported User"
                  name="reportedIds"
                  value={values.reportedIds || []}
                  onChange={(selectedIds) => setFieldValue('reportedIds', selectedIds)}
                  placeholder="Type to search users..."
                />
              </Col>

              <Col md={6} lg={4} className="mb-3">
                <label className="form-label">Status</label>
                <Select
                  isMulti
                  name="statuses"
                  options={statusOptions}
                  value={statusOptions.filter(opt => values.statuses?.includes(opt.value))}
                  onChange={(selected) => {
                    setFieldValue('statuses', selected ? selected.map(s => s.value) : []);
                  }}
                  placeholder="Select status..."
                  styles={selectStyles}
                  isClearable
                />
              </Col>

              <Col md={6} lg={4} className="mb-3">
                <label className="form-label">Reason</label>
                <Select
                  isMulti
                  name="reasons"
                  options={reasonOptions || []}
                  value={reasonOptions?.filter(opt => values.reasons?.includes(opt.value))}
                  onChange={(selected) => {
                    setFieldValue('reasons', selected ? selected.map(s => s.value) : []);
                  }}
                  placeholder="Select reasons..."
                  styles={selectStyles}
                  isClearable
                />
              </Col>

              <Col md={6} lg={4} className="mb-3">
                <IDatePicker
                  label="Created Date From"
                  name="createdDateFrom"
                  value={values.createdDateFrom || ''}
                  onChange={(value) => setFieldValue('createdDateFrom', value)}
                  placeholder="Select start date"
                  max={values.createdDateTo || undefined}
                />
              </Col>

              <Col md={6} lg={4} className="mb-3">
                <IDatePicker
                  label="Created Date To"
                  name="createdDateTo"
                  value={values.createdDateTo || ''}
                  onChange={(value) => setFieldValue('createdDateTo', value)}
                  placeholder="Select end date"
                  min={values.createdDateFrom || undefined}
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

export default UserReportsFilter;
