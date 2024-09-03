
import Requirement from "@app/types/Requirement";
import {callApi} from "./axios";
import endPoints from "./Endpoints";
import DoctorTypeEnum from "@app/types/DoctorTypeEnum";
import EndpointConfig from "@app/types/EndpointConfig";

export const listRequirements = async (doctorType?:DoctorTypeEnum, overrideEndPointConfig?:EndpointConfig): Promise<Requirement[]> => {
  try {
      let endPointConfig = {...endPoints.listRequirements}
      if(overrideEndPointConfig)
        endPointConfig = {...endPointConfig, ...overrideEndPointConfig}; 
      const response = await callApi(endPointConfig, {
        params: {doctor_type: doctorType}
      });
      return response;
  } catch (error) {
    throw error;
  }
};

export const addRequirement = async (requirement: Requirement): Promise<Requirement> => {
  try {
      delete requirement.id;
      const response = await callApi(endPoints.addRequirement, {
        data: requirement
      });
      return response;
  } catch (error) {
    throw error;
  }
};

export const updateRequirement = async (requirement: Requirement): Promise<Requirement> => {
  try {
      const response = await callApi(endPoints.updateRequirement, {
        data: requirement,
        urlParams: {id: requirement.id}
      });
      return response;
  } catch (error) {
    throw error;
  }
};


export const deleteRequirement = async (id: number): Promise<Requirement> => {
  try {
      const response = await callApi(endPoints.deleteRequirement, {
        urlParams: {id}
      });
      return response;
  } catch (error) {
    throw error;
  }
};