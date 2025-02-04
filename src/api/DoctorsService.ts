import Doctor from "@app/types/Doctor";
import { callApi } from "./axios";
import endPoints from "./Endpoints";
import { DoctorPagination } from "@app/types/DoctorPagination";
import { DoctorFilterDto } from "@app/types/DoctorFilterDto";


export const listDoctors = async (): Promise<Doctor[]> => {
  try {
      const response = await callApi(endPoints.listDoctors, {});
      return response;
  } catch (error) {
    throw error;
  }
};

export const verifyDoctor = async (id: number): Promise<void> => {
  try {
      const response = await callApi(endPoints.verifyDoctor, {
        urlParams: {id}
      });
      return response;
  } catch (error) {
    throw error;
  }
};

export const unverifyDoctor = async (id: number): Promise<void> => {
  try {
      const response = await callApi(endPoints.unverifyDoctor, {
        urlParams: {id}
      });
      return response;
  } catch (error) {
    throw error;
  }
};

export const searchDoctors = async (filter: DoctorFilterDto, page: number, size: number): Promise<DoctorPagination> => {
  try {
      const response = await callApi(endPoints.searchDoctors, {
        data: filter,
        params: {page, size}
        
      });
      return response;
  } catch (error) {
    throw error;
  }
};
