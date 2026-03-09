

import axios from "axios";
import ResourceType from "../types/ResourceType";
import { BASE_URL, callApi } from "./axios";
import endPoints from "./Endpoints";
import { toast } from "react-toastify";
import { StoredFile } from "@app/types/StoredFile";
import { FileUploadResponse } from "@app/types/FileUploadResponse";

export const downloadFile = async (filePath: string, preferredName?: string): Promise<void> => {
    try {
        const response = await callApi(endPoints.downloadFile, {
            params: { filePath, preferredName },
            responseType: "blob"

        }, true);

        // Create a URL for the downloaded file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement('a');
        a.href = url;

        // Extract the filename from the Content-Disposition header
        const contentDisposition = response.headers['content-disposition'];
        let filename = preferredName || "downloaded_file"; // Default filename

        if (contentDisposition) {

            const filenameRegex = /filename[^=\n]*=((['"]).*?\2|([^;\n]*))/;
            const matches = filenameRegex.exec(contentDisposition);

            if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '');
            }
        }

        a.setAttribute('download', filename);
        document.body.appendChild(a);
        a.click();

        // Cleanup
        a.remove();
        window.URL.revokeObjectURL(url);

    } catch (error) {
        throw error;
    }
};

export const downloadFileAsync = (fileUrl: string) => {

            // Create a URL for the downloaded file
            const a = document.createElement('a');
            a.href = `${BASE_URL}${fileUrl}`;
    
  
            a.setAttribute('download', "");
            a.setAttribute('target', '_blank')
            document.body.appendChild(a);
            a.click();
    
            // Cleanup
            a.remove();
}




export const downloadFileUrl = `${BASE_URL}${endPoints.downloadFile.url}`;



const initiateFileUpload = async (file: File, resourceType: ResourceType): Promise<FileUploadResponse> => {
    const fileName = file.name;
    const fileSize = file.size;
    const fileType = file.type;
    const response = await callApi(endPoints.generateUploadUrl, {
        data: { fileName, fileType, fileSize, resourceType}

    });
    return response;
}


export const uploadFile = async (file: File, resourceType: ResourceType): Promise<StoredFile> => {
    const uploadResponse = await initiateFileUpload(file, resourceType);
    try {
        const headers = {
          "Content-Type": file.type, // e.g., "image/png"
          "Content-Length": file.size.toString(), // Size in bytes
        };
    
        await axios.put(uploadResponse.uploadUrls[0].uploadUrl, file, { headers });
        return uploadResponse.file;
    } catch (error) {
        toast.error("Upload Failed: " + error);
        throw error;
      }

}
