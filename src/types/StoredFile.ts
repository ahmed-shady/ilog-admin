export interface StoredFile {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  uploaded: boolean;
  multipart: boolean;
  thumbnail?: StoredFile;
  uploadExpiresAt?: string;
  used: boolean;
  resourceId?: number;
  resourceType?: string;
  fileCategory?: string;
  createdAt: string;
  updatedAt: string;
  sizeDescription?: string;
}
