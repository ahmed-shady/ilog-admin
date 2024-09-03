
import { callApi } from "./axios";
import endPoints from "./Endpoints";


export const deleteUser = async (id: number): Promise<void> => {
  try {
      const response = await callApi(endPoints.deleteUser, {
        urlParams: {id}
      });
      return response;
  } catch (error) {
    throw error;
  }
};

export const suspendUser = async (id: number): Promise<void> => {
  try {
      const response = await callApi(endPoints.suspendUser, {
        urlParams: {id}
      });
      return response;
  } catch (error) {
    throw error;
  }
};

export const unsuspendUser = async (id: number): Promise<void> => {
  try {
      const response = await callApi(endPoints.unsuspendUser, {
        urlParams: {id}
      });
      return response;
  } catch (error) {
    throw error;
  }
};