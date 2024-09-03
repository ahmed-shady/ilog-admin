
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

export const addSpeciality = async (name: string): Promise<Speciality> => {
  try {
      const response = await callApi(endPoints.addSpeciality, {
        data: {name}
      });
      return response;
  } catch (error) {
    throw error;
  }
};

export const updateSpeciality = async (id: number, name: string): Promise<Speciality> => {
  try {
      const response = await callApi(endPoints.updateSpeciality, {
        data: {name},
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