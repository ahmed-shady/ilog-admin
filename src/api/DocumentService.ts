
import Document from "@app/types/Document";
import {callApi} from "./axios";
import endPoints from "./Endpoints";
import DocumentVerification from "@app/types/DocumentVerification";

export const listDocuments = async (userId: number): Promise<Document[]> => {
  try {
      const response = await callApi(endPoints.listDocuments, {
        params: {userId}
      });
      return response;
  } catch (error) {
    throw error;
  }
};


export const changeDocumentVerification = async (id: number, verification: DocumentVerification): Promise<void> => {
  try {
      const response = await callApi(endPoints.changeDocumentVerification, {
        urlParams: {id},
        data: verification
      });
      return response;
  } catch (error) {
    throw error;
  }
};