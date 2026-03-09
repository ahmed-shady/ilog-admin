import { StoredFile } from "./StoredFile";

export interface FileUploadResponse {
  file: StoredFile;

  uploadUrls: PresignedUrlInfo[];

  multipart: boolean;
  uploadId: string;

}

export interface PresignedUrlInfo{
    partNumber: number;
    uploadUrl: string;

    startByte: number;
    endByte: number;
    partSize: number;

    expiresAt: string;

}