
import ProcedureOption from "@app/types/ProcedureOption";
import {callApi} from "./axios";
import endPoints from "./Endpoints";
import Speciality from "@app/types/Speciality";

export const listSpecialites = async (): Promise<Speciality[]> => {
  try {
      const response = await callApi(endPoints.listSpeciality, {});
      return response;
  } catch (error) {
    throw error;
  }
};

export const addSpeciality = async (speciality: Speciality): Promise<Speciality> => {
  try {
      const response = await callApi(endPoints.addSpeciality, {
        data: speciality
      });
      return response;
  } catch (error) {
    throw error;
  }
};
export const updateSpeciality = async (id: number, speciality: Speciality): Promise<Speciality> => {
  try {
      const response = await callApi(endPoints.updateSpeciality, {
        data: speciality,
        urlParams: {id}
      });
      return response;
  } catch (error) {
    throw error;
  }
};
export const addProcedures = async (SpecialityId: number, procedures: ProcedureOption[]): Promise<ProcedureOption[]> => {
  try {
      const response = await callApi(endPoints.addProcedures, {
        urlParams: {id: SpecialityId},
        data: procedures
      });
      return response;
  } catch (error) {
    throw error;
  }
};


export const getProcedures = async (specialityId: number): Promise<ProcedureOption[]> => {
  try {
      const response = await callApi(endPoints.getProcedures, {
        params: {specialityId}
      });
      return response;
  } catch (error) {
    throw error;
  }
};


export const getSpeciality = async (id: number): Promise<Speciality> => {
  try {
      const response = await callApi(endPoints.getSpeciality, {
        urlParams: {id}
      });
      return response;
  } catch (error) {
    throw error;
  }
};


export const deleteSpeciality = async (id: number): Promise<Speciality> => {
  try {
      const response = await callApi(endPoints.deleteSpeciality, {
        urlParams: {id}
      });
      return response;
  } catch (error) {
    throw error;
  }
};