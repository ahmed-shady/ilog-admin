
import Requirement from "@app/types/Requirement";
import {callApi} from "./axios";
import endPoints from "./Endpoints";
import { ContactusMessagePagination } from "@app/types/ContactusMessagePagination";

export const listUserMessages = async (page: number, size: number): Promise<ContactusMessagePagination> => {
  try {
      const response = await callApi(endPoints.getContactusMessages, {
        params: {page, size}
      });
      return response;
  } catch (error) {
    throw error;
  }
};


export const deleteMessage = async (id: number): Promise<void> => {
  try {
      const response = await callApi(endPoints.deleteContactusMessage, {
        urlParams: {id}
      });
      return response;
  } catch (error) {
    throw error;
  }
};

export const markMessageAsRead = async (id: number): Promise<void> => {
  try {
      const response = await callApi(endPoints.markContactusMessageAsRead, {
        urlParams: {id}
      });
      return response;
  } catch (error) {
    throw error;
  }
};