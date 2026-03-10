import React, { useState, useEffect } from 'react';
import { Offcanvas, Form, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import IButton from '@app/components/common/IButton';
import FileUploader, { FileUploadStatusChangeEvent, FileUploadStatus } from '@app/components/common/file-uploader/FileUploader';
import RichTextEditor from '@app/components/common/rich-text-editor/RichTextEditor';
import Speciality from '@app/types/Speciality';
import { Country } from '@app/types/Country';
import { LookupDto } from '@app/types/LookupDto';
import { useTranslation } from 'react-i18next';
import './AdminPostAdder.scss';
import { selectStyles } from '@app/utils/SelectStyles';
import { toast } from 'react-toastify';

interface AdminPostAdderProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (post: AdminPostFormData) => void;
  specialities: Speciality[];
  countries: Country[];
  typeOptions: LookupDto[];
}

export interface AdminPostFormData {
  description: string;
  type: string;
  specialityIds: number[];
  countryIds: number[];
  filesIds: number[];
}

interface FormValues {
  description: string;
  type: string;
  specialityIds: number[];
  countryIds: number[];
  images: FileUploadStatusChangeEvent[]; // switched to images array
}

// Number of image upload slots (single source of truth)
const IMAGES_COUNT = 3;

const validationSchema = Yup.object({
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description must not exceed 5000 characters'),
  type: Yup.string()
    .required('Type is required'),
  specialityIds: Yup.array()
    .of(Yup.number())
    .min(0, 'Select at least one speciality'),
  images: Yup.array()
});

const AdminPostAdder: React.FC<AdminPostAdderProps> = ({ show, onHide, onSubmit, specialities, countries, typeOptions }) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const specialityOptions = specialities.map(s => ({
    value: s.id!,
    label: s.name
  }));

  const countryOptions = countries.map(c => ({
    value: c.id,
    label: currentLanguage === 'ar' ? c.nameAr : c.name,
    image: c.image
  }));

  const postTypeOptions = typeOptions.map(t => ({
    value: t.key,
    label: currentLanguage === 'ar' ? t.valueAr : t.valueEn
  }));

  // Helper to create a fresh empty image entry
  const createEmptyImageEntry = (): FileUploadStatusChangeEvent => ({ status: FileUploadStatus.EMPTY, file: undefined });

  return (
    <Offcanvas show={show} onHide={onHide} placement="end" className="admin-post-adder">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          <i className="fas fa-plus-circle me-2"></i>
          Add New Post
        </Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body>
        <Formik<FormValues>
          initialValues={{
            description: '',
            type: '',
            specialityIds: [] as number[],
            countryIds: [] as number[],
            images: Array.from({ length: IMAGES_COUNT }).map(() => createEmptyImageEntry())
          }}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            // Collect uploaded file IDs from images array
            const someImagesFailed = values.images.some(image => image.status === FileUploadStatus.ERROR);
            if(someImagesFailed){
                toast.error('Some images failed to upload. Please fix the errors before submitting.');
                setSubmitting(false);
                return;
            }
            const filesIds = values.images
              .filter(img => img.status === FileUploadStatus.UPLOADED && img.file)
              .map(img => img.file!.id);

            const postData: AdminPostFormData = {
              description: values.description,
              type: values.type,
              specialityIds: values.specialityIds,
              countryIds: values.countryIds,
              filesIds: filesIds
            };

            onSubmit(postData);
            resetForm();
            onHide();
            setSubmitting(false);
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => {

            // Handle file upload status changes by index and update Formik values.images
            const handleFileStatusChange = (event: FileUploadStatusChangeEvent, index: number) => {
              const nextImages = [...values.images];
              // ensure we have an entry at index
              while (nextImages.length <= index) nextImages.push(createEmptyImageEntry());
              nextImages[index] = event;
              setFieldValue('images', nextImages);
            };

            return (
              <Form onSubmit={handleSubmit}>
                {/* Type */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    Type <span className="text-danger">*</span>
                  </Form.Label>
                  <Select
                    options={postTypeOptions}
                    value={postTypeOptions.find(opt => opt.value === values.type)}
                    onChange={(selected) => {
                      setFieldValue('type', selected ? selected.value : '');
                    }}
                    styles={selectStyles}
                    placeholder="Select post type"
                    className={touched.type && errors.type ? 'is-invalid' : ''}
                  />
                  {touched.type && errors.type && (
                    <div className="invalid-feedback d-block">{errors.type}</div>
                  )}
                </Form.Group>

                {/* Description */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    Description <span className="text-danger">*</span>
                  </Form.Label>
                  <RichTextEditor
                    name="description"
                    value={values.description}
                    onChange={(value) => setFieldValue('description', value)}
                    onBlur={handleBlur}
                    placeholder="Share information with doctors... Use formatting and emojis! 😊"
                    rows={8}
                    maxLength={5000}
                    isInvalid={touched.description && !!errors.description}
                  />
                  {touched.description && errors.description && (
                    <div className="invalid-feedback d-block">{errors.description}</div>
                  )}
                </Form.Group>

                {/* Specialities */}
                <Form.Group className="mb-3">
                  <Form.Label>Specialities</Form.Label>
                  <Select
                    isMulti
                    options={specialityOptions}
                    value={specialityOptions.filter(opt => values.specialityIds.includes(opt.value))}
                    onChange={(selected) => {
                      const ids = selected ? selected.map((s: any) => s.value) : [];
                      setFieldValue('specialityIds', ids);
                    }}
                    styles={selectStyles}
                    placeholder="Select specialities (optional)"
                    className={touched.specialityIds && errors.specialityIds ? 'is-invalid' : ''}
                  />
                  {touched.specialityIds && errors.specialityIds && (
                    <div className="invalid-feedback d-block">{errors.specialityIds}</div>
                  )}
                </Form.Group>

                {/* Countries */}
                <Form.Group className="mb-3">
                  <Form.Label>Countries</Form.Label>
                  <Select
                    isMulti
                    options={countryOptions}
                    value={countryOptions.filter(opt => values.countryIds.includes(opt.value))}
                    onChange={(selected) => {
                      const ids = selected ? selected.map((s: any) => s.value) : [];
                      setFieldValue('countryIds', ids);
                    }}
                    styles={selectStyles}
                    placeholder="Select countries (optional)"
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
                </Form.Group>

                {/* File Uploads */}
                <div className="images-section">
                  <h6 className="mb-3">
                    <i className="fas fa-file-upload me-2"></i>
                    Attachments (Maximum 3)
                  </h6>

                  <Row>
                    {values.images.map((img, idx) => (
                      <Col xs={12} md={4} key={idx}>
                        <FileUploader
                          label={`File ${idx + 1}`}
                          value={img.file}
                          onChange={(event) => handleFileStatusChange(event, idx)}
                          accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                          maxSizeMB={10}
                          placeholder={`Upload file ${idx + 1}`}
                        />
                      </Col>
                    ))}
                  </Row>
                </div>

                {/* Actions */}
                <div className="actions-section mt-4">
                  <IButton
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                    icon="fas fa-paper-plane"
                    text="Publish Post"
                    className="w-100"
                  />
                  <IButton
                    type="button"
                    variant="outline-secondary"
                    onClick={onHide}
                    text="Cancel"
                    className="w-100 mt-2"
                  />
                </div>
              </Form>
            );
          }}
        </Formik>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default AdminPostAdder;
