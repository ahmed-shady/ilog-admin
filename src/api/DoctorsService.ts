import Doctor from "@app/types/Doctor";
import LoginResponse from "@app/types/loginResponse";
import User from "@app/types/user";
import axios from "axios";
import { toast } from "react-toastify";
import { callApi } from "./axios";
import endPoints from "./Endpoints";


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
