
import {callApi} from "./axios";
import endPoints from "./Endpoints";
import { Country } from "@app/types/Country";



export const getCountryByName = async (name: string): Promise<Country> => {
  try {
      const response = await callApi(endPoints.getCountryByName, {
        urlParams: {name}
      });
      return response;
  } catch (error) {
    throw error;
  }
};
