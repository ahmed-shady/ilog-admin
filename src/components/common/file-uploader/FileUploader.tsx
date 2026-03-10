import React, { useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import './FileUploader.scss';
import { StoredFile } from '@app/types/StoredFile';
import { initiateFileUpload, uploadFile } from '@app/api/FileService';
import ResourceType from '@app/types/ResourceType';

export enum FileUploadStatus {
  EMPTY = "EMPTY",
  UPLOADING = "UPLOADING",
  UPLOADED = "UPLOADED",
  ERROR = "ERROR"
};

export interface FileUploadStatusChangeEvent {
  file?: StoredFile;
  status: FileUploadStatus;
  error?: string;
}

interface FileUploaderProps {
  label: string;
  value?: StoredFile;
  onChange: (event: FileUploadStatusChangeEvent) => void;
  accept?: string;
  maxSizeMB?: number;
  placeholder?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  label,
  value,
  onChange,
  accept = 'image/*',
  maxSizeMB = 5,
  placeholder = 'Choose file...'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [status, setStatus] = useState<FileUploadStatus>(FileUploadStatus.EMPTY);
  const [uploadedFile, setUploadedFile] = useState<StoredFile | null>(null);
  const [isImage, setIsImage] = useState<boolean>(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input changed');
    const file = e.target.files?.[0];
    setError('');

    if (file) {
      // Validate file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        setError(`File size must be less than ${maxSizeMB}MB`);
        return;
      }

      // Determine if file is an image
      const fileIsImage = file.type.startsWith('image/');
      setIsImage(fileIsImage);

      // Create temporary preview for images only
      console.log('Selected file:', fileIsImage);
      if (fileIsImage) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
      console.log('Selected file:', file);

      handleFileSelect(file);
    }
  };

  const handleFileSelect = async (file: File) => {

    try {

      setStatus(FileUploadStatus.UPLOADING);
      onChange({ status: FileUploadStatus.UPLOADING });
      const uploadInitiateResponse = await initiateFileUpload(file, ResourceType.ADMIN_POST);
      const storedFile = uploadInitiateResponse.file;
      setUploadedFile(storedFile);
      const uploadedFileIsImage = storedFile.fileType.startsWith('image/');
      setIsImage(uploadedFileIsImage);
      if(!uploadedFileIsImage){
      setPreview(storedFile?.thumbnail?.filePath || null);
      }
      await uploadFile(file, uploadInitiateResponse);

      // Set preview from uploaded file

      
      if (uploadedFileIsImage) {
        // Use the file path for images
        setPreview(storedFile.filePath);
      } else if (storedFile.thumbnail?.filePath) {
        // Use thumbnail for non-images (PDF, PowerPoint, etc.)
        setPreview(storedFile.thumbnail.filePath);
      } else {
        setPreview(null);
      }
      
      setStatus(FileUploadStatus.UPLOADED);
      onChange({ status: FileUploadStatus.UPLOADED, file: storedFile });
    } catch (error) {
      setStatus(FileUploadStatus.ERROR);
      onChange({ status: FileUploadStatus.ERROR, error: (error as Error).message });
    } finally {
    }

  };

  const handleRemove = () => {
    setPreview(null);
    setError('');
    setStatus(FileUploadStatus.EMPTY);
    setUploadedFile(null);
    setIsImage(true);
    onChange({ status: FileUploadStatus.EMPTY });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-uploader">
      <label className="form-label">{label}</label>

      <div className="file-uploader-content">
        {preview ? (
          <div className="file-preview">
            <img src={preview} alt="Preview" className="preview-image" />
            <Button
              variant="danger"
              size="sm"
              className="remove-button"
              onClick={handleRemove}
            >
              <i className="fas fa-times"></i>
            </Button>
          </div>
        ) : (
          <div className="file-placeholder" onClick={handleButtonClick}>
            <i className="fas fa-cloud-upload-alt upload-icon"></i>
            <p className="upload-text">{placeholder}</p>
            <p className="upload-hint">Max size: {maxSizeMB}MB</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="file-input"
          style={{ display: 'none' }}
        />
      </div>

      {error && <div className="text-danger mt-2 small">{error}</div>}
      
      {/* Status indicator */}
      {status === FileUploadStatus.UPLOADING && (
        <div className="mt-2 small text-info">
          <i className="fas fa-spinner fa-spin me-1"></i>
          Uploading...
        </div>
      )}
      
      {status === FileUploadStatus.UPLOADED && uploadedFile && (
        <div className="mt-2 small text-success">
          <i className="fas fa-check-circle me-1"></i>
          {uploadedFile.fileName} ({uploadedFile.sizeDescription || `${(uploadedFile.fileSize / 1024).toFixed(2)} KB`})
        </div>
      )}
      
      {status === FileUploadStatus.ERROR && (
        <div className="mt-2 small text-danger">
          <i className="fas fa-exclamation-circle me-1"></i>
          Upload failed. Please try again.
        </div>
      )}
    </div>
  );
};

export default FileUploader;
